# Qualli React Native SDK

Welcome to the Qualli RN SDK! This SDK allows you to effortlessly integrate Qualli's core functionalities into your React Native app. This guide will walk you through the key steps to integrate and use our SDK.

## Table of Contents

-   [Qualli React Native SDK](#qualli-react-native-sdk)
    -   [Table of Contents](#table-of-contents)
    -   [Installation](#installation)
        -   [Install Qualli RN SDK](#install-qualli-rn-sdk)
        -   [Dependencies](#dependencies)
        -   [Install Dependencies](#install-dependencies)
            -   [1. Bare RN installation](#1-bare-rn-installation)
            -   [2. If you are using Expo](#2-if-you-are-using-expo)
            -   [3. Post-Installation](#3-post-installation)
    -   [Usage](#usage)
        -   [Adding the Provider](#adding-the-provider)
        -   [Setting Up Triggers](#setting-up-triggers)
        -   [Setting Custom Attributes](#setting-custom-attributes)
        -   [Anonymous vs Identified accounts](#anonymous-vs-identified-accounts)
        -   [Identifying your users](#identifying-your-users)
    -   [Event Listeners](#event-listeners)
        -   [Available Events](#available-events)
        -   [Implementing Event Listeners](#implementing-event-listeners)
        -   [Handling Events](#handling-events)
    -   [Contribution](#contribution)

## Installation

### Install Qualli RN SDK

To add the Qualli RN SDK to your React Native project, you can use:

```bash
yarn add @qualli/qualli-rn-sdk
```

### Dependencies

Our SDK relies on one essential dependency package. Most likely already present in your application.:

-   `@react-native-async-storage/async-storage` - Used for storing local keys that identify the user.

### Install Dependencies

#### 1. Bare RN installation

Install the necessary dependency using yarn:

```bash
yarn add @react-native-async-storage/async-storage
```

#### 2. If you are using Expo

To ensure compatibility with Expo, use the following command:

```bash
npx expo install @react-native-async-storage/async-storage
```

For Expo, you might need to create a development build. Detailed documentation can be found [here](https://docs.expo.dev/develop/development-builds/installation/).

#### 3. Post-Installation

Install pods

```bash
npx pod install
```

## Usage

### Adding the Provider

To set up Qualli, wrap your main component with `QualliProvider`:

```jsx
import { QualliProvider } from '@qualli/qualli-rn-sdk';

function App() {
    return (
        <QualliProvider apiKey="YOUR_API_KEY_HERE">
            {/* Your components */}
        </QualliProvider>
    );
}
```

### Setting Up Triggers

⚠️ The following triggers are reserved for Qualli, and can't be used:

-   `app_user_identified`
-   `app_user_created`
-   `session_started`
-   `session_ended`
-   `app_opened`
-   `app_closed`
-   `app_backgrounded`
-   `track_screen`

To invoke a trigger, use the `performTrigger` function:

```jsx
const qualli = useQualli();
qualli.performTrigger('TRIGGER_NAME');
```

### Setting Custom Attributes

You have the ability to store your own custom attributes on User level. e.g. you want to add their email, or a custom identifier.

To store user-specific attributes, leverage the `setAttributes` function:

Accepted value types:

-   String
-   Number

The following attributes are provided on root user level. These attributes are reserved and cannot be changed by you:

-   email
-   name
-   first_name
-   last_name
-   email
-   unique_identifier
-   last_seen_web
-   last_seen_app
-   sessions_count
-   app_sessions_count
-   web_sessions_count

```jsx
const qualli = useQualli();

qualli.setAttributes({
    email: 'example@email.com',
    first_name: 'John',
    last_name: 'Doe',
    custom_attribute: 'value',
});
```

### Anonymous vs Identified accounts

By default when a new user opens your app, we will create a anonymous account. When you call `setAttributes` with the `company_identifier` we will create a "active" account.

Anonymous accounts are removed after 14 days, "active" accounts will never be removed. So it's vital to always identify your accounts where possible.

!important!
We will never remove any answers. When we remove the anonymous accounts, all answers remain available.

### Identifying your users

Qualli allows for you to uniquely identify your users, using the `company_identifier` attribute. E.g. when the user logs in to your app, you want all events to be tracked under their main Qualli account, or target them in the audience_filter.

When you set the `company_identifier` we will check if we already have a user with this identifier.

If this is the case: We will transfer the current users attributes to your "parent" user.
If not: We will set the identifier for you to later on re-identify your users.

```jsx
const qualli = useQualli();

qualli.setAttributes({
    email: 'example@email.com',
    first_name: 'John',
    last_name: 'Doe',
    custom_attribute: 'value',
    company_identifier: 'YOUR_UNIQUE_ID',
});
```

## Event Listeners

Qualli RN SDK provides a powerful way to interact with survey events through `event listeners`. You can respond to various survey lifecycle events such as when a survey is completed, shown, or closed. This feature enables you to execute custom logic in response to these events, enhancing the user experience or gathering additional insights.

### Available Events

-   `SURVEY_COMPLETED`: Fired when a user completes a survey.
-   `SURVEY_SHOWN`: Fired when a survey is displayed to the user.
-   `SURVEY_CLOSED`: Fired when a survey is closed without completion.
-   `SURVEY_SKIPPED`: Fired when a survey is skipped with possible partial completion.

### Implementing Event Listeners

    To use event listeners, import SurveyEvents from the Qualli RN SDK along with the useQualli hook. You can then register listeners for the events you're interested in. Here's how to implement event listeners for survey events:

```jsx
import React from 'react';
import {
    QualliProvider,
    useQualli,
    SurveyEvents,
    EventCompletedPayload,
    EventShownPayload,
    EventClosedPayload,
    EventSkippedPayload,
} from '@qualli/qualli-rn-sdk';

const Home = () => {
    const qualli = useQualli();

    React.useEffect(() => {
        if (!qualli?.authenticated) return;

        // Listener for when a survey is completed, with answers
        const completedListener = qualli.on(
            SurveyEvents.SURVEY_COMPLETED,
            (response: EventCompletedPayload) => {
                console.log('Survey Completed:', response);
            },
        );

        // Listener for when a survey is shown
        const openedListener = qualli.on(
            SurveyEvents.SURVEY_SHOWN,
            (response: EventShownPayload) => {
                console.log('Survey Shown:', response);
            },
        );

        // Listener for when a survey is closed
        const closedListener = qualli.on(
            SurveyEvents.SURVEY_CLOSED,
            (response: EventClosedPayload) => {
                console.log('Survey Closed:', response);
            },
        );

        // Listener for when a survey is skipped, with answers
        const skippedListener = qualli.on(
            SurveyEvents.SURVEY_SKIPPED,
            (response: EventSkippedPayload) => {
                console.log('survey_skipped', response);
            },
        );

        // Cleanup listeners when the component unmounts
        return () => {
            completedListener();
            openedListener();
            closedListener();
            skippedListener();
        };
    }, [qualli?.authenticated]);

    return (
        // Your component JSX
    );
};
```

### Handling Events

Each event listener passes a payload object to its callback function, providing details about the survey event. This payload can include information such as the survey ID, user responses, and more, depending on the event.

Use these event listeners to enhance your application's interaction with surveys, such as triggering follow-up actions after a survey is completed, logging analytics events, or customizing the user experience based on survey participation.

## Contribution

We appreciate your contribution to the Qualli RN SDK. If you find any issues or have suggestions, please open an issue or submit a pull request.

---

Happy coding with Qualli RN SDK! 🚀
