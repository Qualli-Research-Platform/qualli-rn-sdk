# Qualli RN SDK

Welcome to the Qualli RN SDK! This SDK allows you to effortlessly integrate Qualli's core functionalities into your React Native app. This guide will walk you through the key steps to integrate and use our SDK.

## Table of Contents

-   [Qualli RN SDK](#qualli-rn-sdk)
    -   [Table of Contents](#table-of-contents)
    -   [Installation](#installation)
    -   [Setup](#setup)
        -   [Adding the Provider](#adding-the-provider)
        -   [Setting Up a Valid Key](#setting-up-a-valid-key)
        -   [Setting up Triggers](#setting-up-triggers)
        -   [Setting Custom Attributes](#setting-custom-attributes)
    -   [Reserved Triggers](#reserved-triggers)
    -   [Contribution](#contribution)

## Installation

```bash
npm install @qualli/qualli-rn-sdk
```

or

```bash
yarn add @qualli/qualli-rn-sdk
```

## Setup

### Adding the Provider

Wrap your main app component with the `QualliProvider` component to make the Qualli functions available throughout your app:

```javascript
import { QualliProvider } from '@qualli/qualli-rn-sdk';

function App() {
    return <QualliProvider>{/* Other components */}</QualliProvider>;
}
```

### Setting Up a Valid Key

To use Qualli's features, you need to initialize the provider with your API key:

```javascript
<QualliProvider apiKey="YOUR_API_KEY_HERE">
    {/* Other components */}
</QualliProvider>
```

Replace `YOUR_API_KEY_HERE` with your actual Qualli API key.

### Setting up Triggers

Using the `useQualli` hook, you can invoke the `performTrigger` function:

```javascript
const qualli = useQualli();

qualli.performTrigger('YOUR_TRIGGER_NAME');
```

Replace `'YOUR_TRIGGER_NAME'` with the name of the trigger you want to activate.

### Setting Custom Attributes

Custom attributes can be set for the user using the `setAttributes` function. Here's an example:

```javascript
const qualli = useQualli();

qualli.setAttributes({
    email: 'email@example.com',
    first_name: 'John',
    last_name: 'Doe',
    customAttribute: 'customValue',
});
```

## Reserved Triggers

The following triggers are reserved by the SDK and should not be used as custom trigger names:

-   `app_user_identified`
-   `app_user_created`
-   `session_started`
-   `session_ended`
-   `app_opened`
-   `app_closed`
-   `app_backgrounded`

## Contribution

We appreciate your contribution to the Qualli RN SDK. If you find any issues or have suggestions, please open an issue or submit a pull request.

---

Happy coding with Qualli RN SDK! 🚀
