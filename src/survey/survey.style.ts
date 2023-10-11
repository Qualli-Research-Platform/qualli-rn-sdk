import styles from '../styles';

const LIGHT_COLOR = '#ffffff';
const DARK_COLOR = styles.colors.darkestGrey;

const survey = {
    colors: {
        lightColor: LIGHT_COLOR,
        darkColor: DARK_COLOR,
    },
    base: {
        title: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 8,
            color: LIGHT_COLOR,
        },
        titleDark: {
            color: DARK_COLOR,
        },
        subtitle: {
            fontSize: 14,
            color: LIGHT_COLOR,
        },
        subtitleDark: {
            color: DARK_COLOR,
        },
        headerContainer: {
            marginBottom: 32,
        },
        button: {
            full: {
                borderRadius: 14,
                paddingVertical: 8,
                paddingHorizontal: 24,
                backgroundColor: LIGHT_COLOR,
            },
            fullDark: {
                backgroundColor: DARK_COLOR,
            },
            underline: {
                textDecorationLine: 'underline',
                color: LIGHT_COLOR,
            },
            underlineDark: {
                color: DARK_COLOR,
            },
            disabled: {
                opacity: 0.5,
            },
            label: {
                fontWeight: 500,
                fontSize: 16,
                textTransform: 'capitalize',
                color: LIGHT_COLOR,
            },
            labelDark: {
                color: DARK_COLOR,
            },
            labelUnderline: {
                textDecorationLine: 'underline',
                fontSize: 14,
                color: LIGHT_COLOR,
            },
            labelUnderlineDark: {
                color: DARK_COLOR,
            },
        },
    },
    form: {
        input: {
            input: {
                borderColor: LIGHT_COLOR,
                borderRadius: 8,
                borderWidth: 1,
                padding: 16,
                fontSize: 14,
                color: DARK_COLOR,
            },
            inputDark: {
                borderColor: DARK_COLOR,
            },
            inputMultiline: {
                height: 120,
                paddingTop: 16,
            },
            placeholder: LIGHT_COLOR + 90,
            placeholderDark: DARK_COLOR + 90,
        },
        select: {
            button: {
                borderColor: LIGHT_COLOR,
                borderRadius: 8,
                borderWidth: 1,
                padding: 16,
                paddingHorizontal: 16,
            },
            buttonSelected: {
                backgroundColor: LIGHT_COLOR,
            },
            buttonDark: {
                borderColor: DARK_COLOR,
            },
            buttonDarkSelected: {
                backgroundColor: DARK_COLOR,
            },
            label: {
                fontWeight: 500,
                fontSize: 14,
                color: LIGHT_COLOR,
            },
            labelSelected: {
                color: DARK_COLOR,
            },
            labelDark: {
                color: DARK_COLOR,
            },
            labelDarkSelected: {
                color: LIGHT_COLOR,
            },
        },
        star: {
            wrapper: {
                flexDirection: 'row',
                width: '100%',
            },
            button: {
                width: 60,
                paddingHorizontal: 5,
            },
            icon: {
                width: 50,
                height: 50,

                tintColor: LIGHT_COLOR,
            },
            iconDark: {
                tintColor: DARK_COLOR,
            },
            iconDarkSelected: {},
            iconSelected: {},
        },
        numeric: {
            wrapper: {
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: '100%',
                justifyContent: 'center',
            },
            button: {
                paddingVertical: 8,
                paddingHorizontal: 8,
                borderWidth: 1,
                borderColor: LIGHT_COLOR,
                height: 40,
                borderRadius: 20,
                marginHorizontal: 4,
                marginVertical: 4,
                justifyContent: 'center',
                alignitems: 'center',
                minWidth: 40,
            },
            buttonDark: {
                borderColor: DARK_COLOR,
            },
            buttonNPS: {
                width: 40,
            },
            buttonSelected: {
                backgroundColor: LIGHT_COLOR,
            },
            buttonSelectedDark: {
                backgroundColor: DARK_COLOR,
            },
            label: {
                textAlign: 'center',
                fontWeight: 600,
                color: LIGHT_COLOR,
            },
            labelDark: {
                color: DARK_COLOR,
            },
            labelSelected: {
                color: DARK_COLOR,
            },
            labelSelectedDark: {
                color: LIGHT_COLOR,
            },
        },
    },
};

export default survey;
