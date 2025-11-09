import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps,
    InspectorControls,
    BlockControls,
    AlignmentToolbar
} from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    ToggleControl,
    SelectControl,
    ColorPicker,
    RangeControl
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

const iconLibraries = [
    { label: 'Font Awesome', value: 'fa' },
    { label: 'Bootstrap Icons', value: 'bi' },
    { label: 'Material Icons', value: 'material' },
];

registerBlockType('web-advisor/icon-block', {
    title: 'Icon Block (Web Advisor)',
    icon: 'star-filled',
    category: 'widgets',
    attributes: {
        iconLibrary: { type: 'string', default: 'fa' },
        iconName: { type: 'string', default: 'fa-solid fa-star' },
        iconSize: { type: 'number', default: 40 },
        iconColor: { type: 'string', default: '#000000' },
        bgColor: { type: 'string', default: '#ffffff' },
        linkURL: { type: 'string', default: '' },
        openInNewTab: { type: 'boolean', default: false },
        align: { type: 'string', default: 'center' },
    },
    supports: { align: ['left', 'center', 'right'], html: false },

    edit: ({ attributes, setAttributes }) => {
        const {
            iconLibrary,
            iconName,
            iconSize,
            iconColor,
            bgColor,
            linkURL,
            openInNewTab,
            align
        } = attributes;

        // 🧠 Normalize color value (string or object)
        const normalizeColor = (val) => {
            if (!val) return '';
            if (typeof val === 'string') return val;
            if (val.rgb) return val.hex ? val.hex : `rgb(${val.rgb.r},${val.rgb.g},${val.rgb.b})`;
            if (val.hex) return val.hex;
            return val;
        };

        const blockProps = useBlockProps({
            style: {
                textAlign: align,
                padding: '10px',
            },
        });

        // ✅ Inline forced styles
        const iconStyle = {
            fontSize: `${iconSize}px`,
            color: `${iconColor} !important`,
            backgroundColor: `${bgColor} !important`,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${iconSize + 20}px`,
            height: `${iconSize + 20}px`,
            borderRadius: '8px',
            lineHeight: 1,
            fill: iconColor,
            stroke: iconColor,
        };

        const renderIcon = () => {
            switch (iconLibrary) {
                case 'material':
                    return (
                        <span
                            className="material-icons"
                            style={iconStyle}
                        >
                            {iconName}
                        </span>
                    );
                case 'bi':
                    return <i className={`bi ${iconName}`} style={iconStyle}></i>;
                default:
                    return <i className={iconName} style={iconStyle}></i>;
            }
        };

        return (
            <Fragment>
                <BlockControls>
                    <AlignmentToolbar
                        value={align}
                        onChange={(value) => setAttributes({ align: value })}
                    />
                </BlockControls>

                <InspectorControls>
                    <PanelBody title="Icon Settings" initialOpen={true}>
                        <SelectControl
                            label="Icon Library"
                            value={iconLibrary}
                            options={iconLibraries}
                            onChange={(val) => setAttributes({ iconLibrary: val })}
                        />
                        <TextControl
                            label="Icon Name / Class"
                            help="Font Awesome: fa-solid fa-heart | Bootstrap: bi-alarm | Material: home"
                            value={iconName}
                            onChange={(val) => setAttributes({ iconName: val })}
                        />
                        <RangeControl
                            label="Icon Size (px)"
                            value={iconSize}
                            min={10}
                            max={200}
                            onChange={(val) => setAttributes({ iconSize: val })}
                        />

                        <p><strong>Icon Color</strong></p>
                        <ColorPicker
                            color={iconColor}
                            onChange={(val) =>
                                setAttributes({ iconColor: normalizeColor(val) })
                            }
                            disableAlpha
                        />

                        <p style={{ marginTop: '10px' }}><strong>Background Color</strong></p>
                        <ColorPicker
                            color={bgColor}
                            onChange={(val) =>
                                setAttributes({ bgColor: normalizeColor(val) })
                            }
                            disableAlpha
                        />
                    </PanelBody>

                    <PanelBody title="Link Settings" initialOpen={false}>
                        <TextControl
                            label="Link URL"
                            value={linkURL}
                            onChange={(val) => setAttributes({ linkURL: val })}
                            placeholder="https://example.com"
                        />
                        <ToggleControl
                            label="Open in New Tab"
                            checked={openInNewTab}
                            onChange={(val) => setAttributes({ openInNewTab: val })}
                        />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    {linkURL ? (
                        <a
                            href={linkURL}
                            target={openInNewTab ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none' }}
                        >
                            {renderIcon()}
                        </a>
                    ) : (
                        renderIcon()
                    )}
                </div>
            </Fragment>
        );
    },

    save: ({ attributes }) => {
        const {
            iconLibrary,
            iconName,
            iconSize,
            iconColor,
            bgColor,
            linkURL,
            openInNewTab,
            align
        } = attributes;

        const iconStyle = {
            fontSize: `${iconSize}px`,
            color: `${iconColor} !important`,
            backgroundColor: `${bgColor} !important`,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${iconSize + 20}px`,
            height: `${iconSize + 20}px`,
            borderRadius: '8px',
            lineHeight: 1,
            fill: iconColor,
            stroke: iconColor,
        };

        const getIcon = () => {
            switch (iconLibrary) {
                case 'material':
                    return <span className="material-icons" style={iconStyle}>{iconName}</span>;
                case 'bi':
                    return <i className={`bi ${iconName}`} style={iconStyle}></i>;
                default:
                    return <i className={iconName} style={iconStyle}></i>;
            }
        };

        return (
            <div {...useBlockProps.save({ style: { textAlign: align, padding: '10px' } })}>
                {linkURL ? (
                    <a
                        href={linkURL}
                        target={openInNewTab ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none' }}
                    >
                        {getIcon()}
                    </a>
                ) : (
                    getIcon()
                )}
            </div>
        );
    },
});
