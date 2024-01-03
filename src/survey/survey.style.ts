const survey = {
    base: {
        title: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 8,
        },
        titleCentered: {
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 14,
        },
        subtitleCentered: {
            textAlign: 'center',
        },
        headerContainer: {
            padding: 16,
        },
        button: {
            full: {
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 24,
            },
            underline: {
                textDecorationLine: 'underline',
            },
            disabled: {
                opacity: 0.5,
            },
            label: {
                fontWeight: 500,
                fontSize: 16,
            },
            labelUnderline: {
                textDecorationLine: 'underline',
                fontSize: 14,
            },
        },
    },
    slide: {
        CTAContainer: {
            padding: 16,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            width: '100%',
        },
        CTAContainerText: {
            // padding: 16,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
        },
        previousButton: {
            marginRight: 16,
        },
    },
    form: {
        input: {
            input: {
                borderRadius: 8,
                borderWidth: 1,
                padding: 16,
                fontSize: 14,
            },
            inputMultiline: {
                height: 120,
                paddingTop: 16,
            },
        },
        select: {
            button: {
                borderRadius: 8,
                borderWidth: 1,
                padding: 16 + 3, // default padding + spacing for border
                paddingHorizontal: 16,
                position: 'relative',
                overflow: 'hidden',
            },
            borderCollapse: {
                position: 'absolute',
                top: -1,
                right: -1,
                bottom: -1,
                left: -1,
                borderWidth: 3,
                borderRadius: 8,
            },
            labelWrapper: {
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            },
            label: {
                fontWeight: 500,
                fontSize: 14,
            },
            icon: {
                width: 15,
                height: 15,
            },
        },
        star: {
            wrapper: {
                flexDirection: 'row',
                width: '100%',
            },
            button: {
                width: 60,
                height: 60,
                paddingHorizontal: 5,
                alignItens: 'center',
                justifyContent: 'center',
            },
            icon: {
                width: 50,
                height: 50,
            },
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
                height: 45,
                borderRadius: 6,
                marginHorizontal: 2,
                marginVertical: 2,
                justifyContent: 'center',
                alignitems: 'center',
                minWidth: 45,
            },
            buttonNPS: {
                width: 40,
            },
            label: {
                textAlign: 'center',
                fontWeight: 600,
            },
        },
    },
};

export default survey;
