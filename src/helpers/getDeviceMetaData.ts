import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const getDeviceMetaData = async () => {
    const metadata: {
        app_version: string;
        os_version: string;
        manufacturer: string;
        device_id: string;
        is_tablet: string;
        system_name: string;
        build_number: string;
        bundle_id: string;
        brand: string;
        os: string;
    } = {
        app_version: '',
        os_version: '',
        manufacturer: '',
        device_id: '',
        is_tablet: 'no',
        system_name: '',
        build_number: '',
        bundle_id: '',
        brand: '',
        os: '',
    };

    // // App Version
    metadata.app_version = DeviceInfo.getVersion();

    // OS Version
    metadata.os_version = DeviceInfo.getSystemVersion();

    // Timezone
    // metadata.timezone = DeviceInfo.getTimezone();

    // Manufacturer
    metadata.manufacturer = await DeviceInfo.getManufacturer();

    // Device ID
    metadata.device_id = DeviceInfo.getDeviceId();

    // Is Tablet
    metadata.is_tablet = DeviceInfo.isTablet() ? 'yes' : 'no';

    // System Name
    metadata.system_name = Platform.OS;

    // Build Number
    metadata.build_number = DeviceInfo.getBuildNumber();

    // Bundle Id
    metadata.bundle_id = DeviceInfo.getBundleId();

    // Brand
    metadata.brand = DeviceInfo.getBrand();

    // OS
    metadata.os = Platform.OS;

    return metadata;
};

export default getDeviceMetaData;
