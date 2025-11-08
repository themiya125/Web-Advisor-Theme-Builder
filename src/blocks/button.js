import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps,
    InspectorControls,
    BlockControls,
    AlignmentToolbar,
    ColorPalette,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

const COLORS = [
    { name: 'Blue', color: '#0073aa' },
    { name: 'Green', color: '#46b450' },
    { name: 'Red', color: '#dc3232' },
    { name: 'Orange', color: '#ffb900' },
    { name: 'Black', color: '#000000' },
    { name: 'White', color: '#ffffff' },
];

registerBlockType('web-advisor/button-block', {
    title: 'Button Block',
    icon: 'button',
    category: 'layout',
    attributes: {
        buttonText: { type: 'string', default: 'Click Me' },
        buttonUrl: { type: 'string', default: '' },
        isExternal: { type: 'boolean', default: false },
        bgColor: { type: 'string', default: '#0073aa' },
        textColor: { type: 'string', default: '#ffffff' },
        alignment: { type: 'string', default: 'center' },
    },
    supports: { html: false },

    edit: ({ attributes, setAttributes }) => {
        const { buttonText, buttonUrl, isExternal, bgColor, textColor, alignment } = attributes;
        const blockProps = useBlockProps({ style: { textAlign: alignment, margin: '10px 0' } });

        return (
            <Fragment>
                <BlockControls>
                    <AlignmentToolbar
                        value={alignment}
                        onChange={(nextAlign) => setAttributes({ alignment: nextAlign || 'center' })}
                    />
                </BlockControls>

                <InspectorControls>
                    <PanelBody title="Button Settings" initialOpen={true}>
                        <TextControl
                            label="Button Text"
                            value={buttonText}
                            onChange={(value) => setAttributes({ buttonText: value })}
                        />
                        <TextControl
                            label="Button URL"
                            value={buttonUrl}
                            onChange={(value) => setAttributes({ buttonUrl: value })}
                            placeholder="https://example.com"
                        />
                        <ToggleControl
                            label="Open link in new tab"
                            checked={isExternal}
                            onChange={(value) => setAttributes({ isExternal: value })}
                        />
                    </PanelBody>

                    <PanelBody title="Colors" initialOpen={true}>
                        <p><strong>Background Color</strong></p>
                        <ColorPalette
                            colors={COLORS}
                            value={bgColor}
                            onChange={(color) => setAttributes({ bgColor: color })}
                        />
                        <p style={{ marginTop: '15px' }}><strong>Text Color</strong></p>
                        <ColorPalette
                            colors={COLORS}
                            value={textColor}
                            onChange={(color) => setAttributes({ textColor: color })}
                        />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <a
                        href={buttonUrl || '#'}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        style={{
                            backgroundColor: bgColor,
                            color: textColor,
                            padding: '10px 20px',
                            borderRadius: '5px',
                            textDecoration: 'none',
                            display: 'inline-block',
                        }}
                    >
                        {buttonText}
                    </a>
                </div>
            </Fragment>
        );
    },

    save: ({ attributes }) => {
        const { buttonText, buttonUrl, isExternal, bgColor, textColor, alignment } = attributes;
        const blockProps = useBlockProps.save({ style: { textAlign: alignment } });
        return (
            <div {...blockProps}>
                <a
                    href={buttonUrl || '#'}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="web-advisor-button"
                    style={{
                        backgroundColor: bgColor,
                        color: textColor,
                        padding: '10px 20px',
                        borderRadius: '5px',
                        textDecoration: 'none',
                        display: 'inline-block',
                    }}
                >
                    {buttonText}
                </a>
            </div>
        );
    },
});
