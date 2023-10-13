import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const getDeviceMetaData = async () => {
    let metadata: {
        app_version: string;
        os_version: string;
        manufacturer: string;
        device_id: string;
        is_tablet: boolean;
        locale: string;
        system_name: string;
        build_number: string;
        bundle_id: string;
        brand: string;
    } = {
        app_version: '',
        os_version: '',
        manufacturer: '',
        device_id: '',
        is_tablet: false,
        system_name: '',
        build_number: '',
        bundle_id: '',
        brand: '',
        locale: '',
    };

    // // App Version
    metadata.app_version = DeviceInfo.getVersion();

    // // OS Version
    // metadata.os_version = DeviceInfo.getSystemVersion();

    // // Timezone
    // // metadata.timezone = DeviceInfo.getTimezone();

    // // metadata.locale = '';

    // // if (Platform.OS === 'ios') {
    // //     metadata.locale =
    // //         NativeModules.SettingsManager.settings.AppleLocale ||
    // //         NativeModules.SettingsManager.settings.AppleLanguages[0];
    // // } else if (Platform.OS === 'android') {
    // //     metadata.locale = NativeModules.I18nManager.localeIdentifier; // "fr_FR"
    // // }

    // // Manufacturer
    // metadata.manufacturer = await DeviceInfo.getManufacturer();

    // // Device ID
    // metadata.device_id = DeviceInfo.getDeviceId();

    // // Is Tablet
    // metadata.is_tablet = DeviceInfo.isTablet();

    // // System Name
    // metadata.system_name = Platform.OS;

    // // Build Number
    // metadata.build_number = DeviceInfo.getBuildNumber();

    // // Bundle Id
    // metadata.bundle_id = DeviceInfo.getBundleId();

    // // Brand
    // metadata.brand = DeviceInfo.getBrand();

    return metadata;
};

export default getDeviceMetaData;
