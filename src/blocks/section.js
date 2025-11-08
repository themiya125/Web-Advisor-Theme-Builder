import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps,
    InnerBlocks,
    InspectorControls,
    BlockControls,
    AlignmentToolbar,
    MediaUpload,
    MediaUploadCheck
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    SelectControl
} from '@wordpress/components';
import { Fragment, useEffect, useRef } from '@wordpress/element';

/* -----------------------------
   Background Options
----------------------------- */

const backgroundOptions = [
    { label: 'Cover', value: 'cover' },
    { label: 'Contain', value: 'contain' },
    { label: 'Auto', value: 'auto' },
];

const backgroundPositionOptions = [
    { label: 'Center Center', value: 'center center' },
    { label: 'Top Left', value: 'top left' },
    { label: 'Top Center', value: 'top center' },
    { label: 'Top Right', value: 'top right' },
    { label: 'Center Left', value: 'center left' },
    { label: 'Center Right', value: 'center right' },
    { label: 'Bottom Left', value: 'bottom left' },
    { label: 'Bottom Center', value: 'bottom center' },
    { label: 'Bottom Right', value: 'bottom right' },
];

/* -----------------------------
   Custom CSS Code Editor
----------------------------- */

const CustomCSSEditor = ({ value, onChange }) => {
    const containerRef = useRef(null);
    const editorRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || editorRef.current || !wp.codeEditor) return;

        const textarea = document.createElement('textarea');
        containerRef.current.appendChild(textarea);

        const settings = wp.codeEditor.defaultSettings
            ? { ...wp.codeEditor.defaultSettings }
            : {};
        settings.codemirror = {
            ...settings.codemirror,
            mode: 'css',
            lineNumbers: true,
            extraKeys: { 'Ctrl-Space': 'autocomplete' },
        };

        editorRef.current = wp.codeEditor.initialize(textarea, settings);
        editorRef.current.codemirror.on('change', (cm) => onChange(cm.getValue()));
        editorRef.current.codemirror.setValue(value);
    }, []);

    useEffect(() => {
        if (editorRef.current && editorRef.current.codemirror.getValue() !== value) {
            editorRef.current.codemirror.setValue(value);
        }
    }, [value]);

    return <div ref={containerRef} style={{ minHeight: '120px' }}></div>;
};

/* -----------------------------
   Section Block Registration
----------------------------- */

registerBlockType('web-advisor/section-block', {
    title: 'Section Block',
    icon: 'welcome-write-blog',
    category: 'layout',
    attributes: {
        customCSS: { type: 'string', default: '' },
        bgImage: { type: 'string', default: '' },
        bgSize: { type: 'string', default: 'cover' },
        bgPosition: { type: 'string', default: 'center center' },
        align: { type: 'string', default: 'full' },
    },
    supports: { align: ['wide', 'full'], html: false },

    edit: ({ attributes, setAttributes }) => {
        const { customCSS, bgImage, bgSize, bgPosition, align } = attributes;

        const blockProps = useBlockProps({
            style: {
                backgroundImage: bgImage ? `url(${bgImage})` : undefined,
                backgroundSize: bgSize,
                backgroundPosition: bgPosition,
                minHeight: '150px',
                padding: '20px',
                border: '1px dashed #ccc',
            },
            className: `web-advisor-block-align-${align}`,
        });

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title="Custom CSS" initialOpen={true}>
                        <CustomCSSEditor
                            value={customCSS}
                            onChange={(val) => setAttributes({ customCSS: val })}
                        />

                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={(media) => setAttributes({ bgImage: media.url })}
                                allowedTypes={['image']}
                                render={({ open }) => (
                                    <Button
                                        onClick={open}
                                        isPrimary
                                        style={{ marginTop: '20px', marginBottom: '20px' }}
                                    >
                                        {bgImage
                                            ? 'Change Background Image'
                                            : 'Set Background Image'}
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>

                        <SelectControl
                            label="Background Size"
                            value={bgSize}
                            options={backgroundOptions}
                            onChange={(value) => setAttributes({ bgSize: value })}
                        />

                        <SelectControl
                            label="Background Position"
                            value={bgPosition}
                            options={backgroundPositionOptions}
                            onChange={(value) => setAttributes({ bgPosition: value })}
                        />
                    </PanelBody>
                </InspectorControls>

                <BlockControls>
                    <AlignmentToolbar
                        value={align}
                        onChange={(value) => setAttributes({ align: value })}
                    />
                </BlockControls>

                <section {...blockProps}>
                    <InnerBlocks renderAppender={() => <InnerBlocks.ButtonBlockAppender />} />
                </section>
            </Fragment>
        );
    },

    save: ({ attributes }) => {
        const { bgImage, bgSize, bgPosition, align, customCSS } = attributes;

        const blockProps = useBlockProps.save({
            style: {
                backgroundImage: bgImage ? `url(${bgImage})` : undefined,
                backgroundSize: bgSize,
                backgroundPosition: bgPosition,
            },
            className: `web-advisor-block-align-${align}`,
        });

        const inlineStyle = customCSS ? <style>{customCSS}</style> : null;

        return (
            <section {...blockProps}>
                <InnerBlocks.Content />
                {inlineStyle}
            </section>
        );
    },
});
