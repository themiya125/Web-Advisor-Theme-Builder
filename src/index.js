import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps,
    InnerBlocks,
    InspectorControls,
    BlockControls,
    AlignmentToolbar,
    MediaUpload,
    MediaUploadCheck,
    ColorPalette,
    RichText
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    SelectControl,
    TextControl,
    ToggleControl
} from '@wordpress/components';
import { Fragment, useEffect, useRef } from '@wordpress/element';

/* -----------------------------
   Common Background Controls
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
   Layout Block Factory
----------------------------- */

const createBlock = (name, title, icon) => {
    registerBlockType(name, {
        title,
        icon,
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
                className: `wab-block-align-${align}`,
            });

            const WrapperTag = name === 'wab/section-block' ? 'section' : 'div';

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
                                        <Button onClick={open} isPrimary style={{ marginTop: '20px', marginBottom:'20px' }}>
                                            {bgImage ? 'Change Background Image' : 'Set Background Image'}
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

                    <WrapperTag {...blockProps}>
                        <InnerBlocks renderAppender={() => <InnerBlocks.ButtonBlockAppender />} />
                    </WrapperTag>
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
                className: `wab-block-align-${align}`,
            });

            const inlineStyle = customCSS ? <style>{customCSS}</style> : null;
            const WrapperTag = name === 'wab/section-block' ? 'section' : 'div';

            return (
                <WrapperTag {...blockProps}>
                    <InnerBlocks.Content />
                    {inlineStyle}
                </WrapperTag>
            );
        },
    });
};

// Register layout blocks
createBlock('wab/div-block', 'Div Block', 'editor-code');
createBlock('wab/section-block', 'Section Block', 'welcome-write-blog');
createBlock('wab/container-block', 'Container Block', 'screenoptions');

/* -----------------------------
   Button Block (Updated)
----------------------------- */

const COLORS = [
    { name: 'Blue', color: '#0073aa' },
    { name: 'Green', color: '#46b450' },
    { name: 'Red', color: '#dc3232' },
    { name: 'Orange', color: '#ffb900' },
    { name: 'Black', color: '#000000' },
    { name: 'White', color: '#ffffff' },
];

registerBlockType('wab/button-block', {
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
                            label="Open link in new tab (External)"
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
                    className="wab-button"
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

/* -----------------------------
   Home Slider Block (with JS slider)
----------------------------- */

registerBlockType('wab/home-slider', {
    title: 'Home Page Slider',
    icon: 'images-alt2',
    category: 'layout',
    attributes: {
        slides: { type: 'array', default: [] },
    },

 edit: ({ attributes, setAttributes }) => {
    const { slides } = attributes;

    const addSlide = () => {
        const newSlide = {
            title: 'Main Title',
            subtitle: 'Sub Title',
            buttonText: 'Learn More',
            buttonUrl: '',
            isExternal: false,
            image: '',
        };
        setAttributes({ slides: [...slides, newSlide] });
    };

    const updateSlide = (index, key, value) => {
        const updated = [...slides];
        updated[index][key] = value;
        setAttributes({ slides: updated });
    };

    return (
        <div {...useBlockProps()} className="wab-slider-edit">
            <InspectorControls>
                <PanelBody title="Slider Settings" initialOpen={true}>
                    <Button isPrimary onClick={addSlide} style={{ marginBottom: '10px' }}>
                        + Add New Slide
                    </Button>

                    {slides.map((slide, index) => (
                        <div key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                            <p><strong>Slide {index + 1}</strong></p>
                            
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={(media) => updateSlide(index, 'image', media.url)}
                                    allowedTypes={['image']}
                                    render={({ open }) => (
                                        <Button onClick={open} isSecondary style={{ marginBottom: '10px' }}>
                                            {slide.image ? 'Change Image' : 'Upload Image'}
                                        </Button>
                                    )}
                                />
                            </MediaUploadCheck>

                            <TextControl
                                label="Main Title"
                                value={slide.title}
                                onChange={(val) => updateSlide(index, 'title', val)}
                            />

                            <TextControl
                                label="Sub Title"
                                value={slide.subtitle}
                                onChange={(val) => updateSlide(index, 'subtitle', val)}
                            />

                            <TextControl
                                label="Button Text"
                                value={slide.buttonText}
                                onChange={(val) => updateSlide(index, 'buttonText', val)}
                            />

                            <TextControl
                                label="Button URL"
                                value={slide.buttonUrl}
                                onChange={(val) => updateSlide(index, 'buttonUrl', val)}
                            />

                            <ToggleControl
                                label="Open link in new tab"
                                checked={slide.isExternal}
                                onChange={(val) => updateSlide(index, 'isExternal', val)}
                            />
                        </div>
                    ))}
                </PanelBody>
            </InspectorControls>

            {/* Slider Preview */}
            <div className="wab-slider-preview" style={{ minHeight: '200px', position: 'relative', overflow: 'hidden', background: '#000' }}>
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="wab-slider-item"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '200px',
                            backgroundImage: `url(${slide.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            color: '#fff',
                            padding: '20px',
                            position: 'relative',
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <h2>{slide.title}</h2>
                            <p>{slide.subtitle}</p>
                            {slide.buttonText && (
                                <a
                                    href={slide.buttonUrl || '#'}
                                    target={slide.isExternal ? '_blank' : undefined}
                                    rel={slide.isExternal ? 'noopener noreferrer' : undefined}
                                    className="wab-slide-btn"
                                    style={{
                                        display: 'inline-block',
                                        padding: '8px 20px',
                                        backgroundColor: '#0073aa',
                                        color: '#fff',
                                        borderRadius: '4px',
                                        textDecoration: 'none',
                                        marginTop: '10px',
                                    }}
                                >
                                    {slide.buttonText}
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
},


    save: ({ attributes }) => {
        const { slides } = attributes;
        const blockProps = useBlockProps.save();

        return (
            <div {...blockProps} className="wab-slider">
                <div className="wab-slides">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className="wab-slide"
                            style={{
                                backgroundImage: `url(${slide.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="wab-slide-content">
                                <h2>{slide.title}</h2>
                                <p>{slide.subtitle}</p>
                                {slide.buttonText && (
                                    <a
                                        href={slide.buttonUrl || '#'}
                                        target={slide.isExternal ? '_blank' : undefined}
                                        rel={slide.isExternal ? 'noopener noreferrer' : undefined}
                                        className="wab-slide-btn"
                                    >
                                        {slide.buttonText}
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <button className="wab-prev">❮</button>
                <button className="wab-next">❯</button>

                <script>
                    {`
                    document.addEventListener('DOMContentLoaded', function() {
                        const slider = document.querySelector('.wab-slider');
                        if (!slider) return;

                        const slides = slider.querySelectorAll('.wab-slide');
                        let index = 0;

                        function showSlide(i) {
                            slides.forEach((s, idx) => {
                                s.style.display = idx === i ? 'block' : 'none';
                            });
                        }

                        showSlide(index);

                        slider.querySelector('.wab-prev').addEventListener('click', () => {
                            index = (index - 1 + slides.length) % slides.length;
                            showSlide(index);
                        });

                        slider.querySelector('.wab-next').addEventListener('click', () => {
                            index = (index + 1) % slides.length;
                            showSlide(index);
                        });
                    });
                    `}
                </script>
            </div>
        );
    },
});
