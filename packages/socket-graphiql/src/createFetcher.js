// @flow

import {getOperationType} from "@jumpn/utils-graphql";

import type {GqlRequestCompat} from "@jumpn/utils-graphql/compat/cjs/types";

import SubscriptionClient from "./SubscriptionsClient";

const parseIfJson = text => {
  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
};

const responseToText = response => response.text();

const postJson = (url: string, body: Object): Promise<string> =>
  fetch(url, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    credentials: "include"
  })
    .then(responseToText)
    .then(parseIfJson);

const getSubscribeCallback = observer => (error, result) => {
  if (error) {
    if (observer.error) {
      observer.error(JSON.stringify(error, null, "  "));
    } else {
      observer(error);
    }
  } else if (observer.next) {
    observer.next(result);
  } else {
    observer(result);
  }
};

const subscribeWithObservable = (
  state,
  subscriptionsClient,
  subscriptionSentMessage,
  gqlRequestCompat
) => ({
  subscribe: (observer: {error: Function, next: Function}) => {
    state.activeSubscriptionId = subscriptionsClient.subscribe(
      gqlRequestCompat,
      getSubscribeCallback(observer)
    );
    if (state.activeSubscriptionId) {
      observer.next(subscriptionSentMessage);
    }
  }
});

/**
 * Creates a Fetcher using the given arguments
 */
const createFetcher = (
  apiUrl: string,
  subscriptionsClient: SubscriptionClient,
  subscriptionSentMessage: string,
  useSocketForQueriesAndMutations: boolean
) => {
  const state = {activeSubscriptionId: undefined};

  return (gqlRequestCompat: GqlRequestCompat<any>) => {
    if (state.activeSubscriptionId) {
      subscriptionsClient.unsubscribe(state.activeSubscriptionId);
    }

    return getOperationType(gqlRequestCompat.query) !== "subscription" && !useSocketForQueriesAndMutations
      ? postJson(apiUrl, gqlRequestCompat)
      : subscribeWithObservable(
          state,
          subscriptionsClient,
          subscriptionSentMessage,
          gqlRequestCompat
        );
  };
};

export default createFetcher;
