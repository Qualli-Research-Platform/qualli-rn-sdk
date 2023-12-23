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

## Contribution

We appreciate your contribution to the Qualli RN SDK. If you find any issues or have suggestions, please open an issue or submit a pull request.

---

Happy coding with Qualli RN SDK! 🚀
