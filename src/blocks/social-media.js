import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps,
    InspectorControls
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    TextControl,
    ToggleControl,
    RangeControl,
    ColorPalette
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';

registerBlockType('web-advisor/social-media-block', {
    title: 'Social Media Block (Web Advisor)',
    icon: 'share',
    category: 'design',
    attributes: {
        socials: { type: 'array', default: [] },
        showName: { type: 'boolean', default: false },
        fontSize: { type: 'number', default: 24 },
        iconColor: { type: 'string', default: '#ffffff' },
        bgColor: { type: 'string', default: '#0073aa' },
        hoverColor: { type: 'string', default: '#005177' },
        borderRadius: { type: 'number', default: 8 },
        enableShareButton: { type: 'boolean', default: false },
    },

    edit: ({ attributes, setAttributes }) => {
        const {
            socials,
            showName,
            fontSize,
            iconColor,
            bgColor,
            hoverColor,
            borderRadius,
            enableShareButton
        } = attributes;

        // Load Font Awesome in editor for preview
        useEffect(() => {
            const fa = document.createElement('link');
            fa.rel = 'stylesheet';
            fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
            document.head.appendChild(fa);
            return () => document.head.removeChild(fa);
        }, []);

        // Add new social media item to top
        const addSocial = () => {
            const newSocial = {
                name: 'Facebook',
                iconClass: 'fa-brands fa-facebook-f',
                url: '',
                isExternal: true,
            };
            setAttributes({ socials: [newSocial, ...socials] });
        };

        const updateSocial = (index, key, value) => {
            const updated = [...socials];
            updated[index][key] = value;
            setAttributes({ socials: updated });
        };

        const removeSocial = (index) => {
            const updated = socials.filter((_, i) => i !== index);
            setAttributes({ socials: updated });
        };

        const socialStyle = {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColor,
            color: iconColor,
            borderRadius: `${borderRadius}px`,
            fontSize: `${fontSize}px`,
            width: `${fontSize + 16}px`,
            height: `${fontSize + 16}px`,
            margin: '5px',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
        };

        return (
            <div {...useBlockProps()}>
                <InspectorControls>

                    {/* ✅ Moved Manage Social Links FIRST */}
                    <PanelBody title="Manage Social Links" initialOpen={true}>
                        <Button
                            isPrimary
                            onClick={addSocial}
                            style={{ marginBottom: '10px' }}
                        >
                            + Add Social Media
                        </Button>

                        {socials.map((social, index) => (
                            <div
                                key={index}
                                style={{
                                    marginBottom: '20px',
                                    borderBottom: '1px solid #ddd',
                                    paddingBottom: '10px',
                                }}
                            >
                                <TextControl
                                    label="Social Name"
                                    value={social.name}
                                    onChange={(val) =>
                                        updateSocial(index, 'name', val)
                                    }
                                />
                                <TextControl
                                    label="Font Awesome Icon Class"
                                    value={social.iconClass}
                                    onChange={(val) =>
                                        updateSocial(index, 'iconClass', val)
                                    }
                                    help="Example: fa-brands fa-twitter"
                                />
                                <TextControl
                                    label="Profile URL"
                                    value={social.url}
                                    onChange={(val) =>
                                        updateSocial(index, 'url', val)
                                    }
                                />
                                <ToggleControl
                                    label="Open in new tab"
                                    checked={social.isExternal}
                                    onChange={(val) =>
                                        updateSocial(index, 'isExternal', val)
                                    }
                                />
                                <Button
                                    isDestructive
                                    onClick={() => removeSocial(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </PanelBody>

                    {/* 🎨 General Settings come AFTER */}
                    <PanelBody title="General Settings" initialOpen={false}>
                        <ToggleControl
                            label="Show Social Media Name"
                            checked={showName}
                            onChange={(val) => setAttributes({ showName: val })}
                        />

                        <RangeControl
                            label="Font Size"
                            value={fontSize}
                            onChange={(val) => setAttributes({ fontSize: val })}
                            min={10}
                            max={60}
                            step={2}
                        />

                        <p><strong>Icon Color</strong></p>
                        <ColorPalette
                            value={iconColor}
                            onChange={(val) => setAttributes({ iconColor: val })}
                        />

                        <p><strong>Background Color</strong></p>
                        <ColorPalette
                            value={bgColor}
                            onChange={(val) => setAttributes({ bgColor: val })}
                        />

                        <p><strong>Hover Color</strong></p>
                        <ColorPalette
                            value={hoverColor}
                            onChange={(val) => setAttributes({ hoverColor: val })}
                        />

                        <RangeControl
                            label="Border Radius"
                            value={borderRadius}
                            onChange={(val) => setAttributes({ borderRadius: val })}
                            min={0}
                            max={50}
                            step={1}
                        />

                        <ToggleControl
                            label="Enable Share Icon Button"
                            checked={enableShareButton}
                            onChange={(val) => setAttributes({ enableShareButton: val })}
                        />
                    </PanelBody>
                </InspectorControls>

                {/* 🔍 Live Preview in Editor */}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    {socials.map((social, index) => (
                        <a
                            key={index}
                            href={social.url || '#'}
                            target={social.isExternal ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            style={socialStyle}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = hoverColor)}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = bgColor)}
                        >
                            <i className={social.iconClass}></i>
                            {showName && (
                                <span style={{ marginLeft: '8px', fontSize: '14px' }}>
                                    {social.name}
                                </span>
                            )}
                        </a>
                    ))}

                    {enableShareButton && (
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                const url = encodeURIComponent(window.location.href);
                                const text = encodeURIComponent(document.title);
                                window.open(
                                    `https://www.facebook.com/sharer/sharer.php?u=${url}&text=${text}`,
                                    '_blank'
                                );
                            }}
                            style={{
                                ...socialStyle,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = hoverColor)}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = bgColor)}
                            title="Share Current Page"
                        >
                            <i className="fa-solid fa-share-nodes"></i>
                        </a>
                    )}
                </div>
            </div>
        );
    },

    save: ({ attributes }) => {
        const {
            socials,
            showName,
            fontSize,
            iconColor,
            bgColor,
            borderRadius,
            enableShareButton
        } = attributes;

        const blockProps = useBlockProps.save();

        return (
            <div {...blockProps}>
                <div className="social-icons-wrapper" style={{ textAlign: 'center' }}>
                    {socials.map((social, index) => (
                        <a
                            key={index}
                            href={social.url || '#'}
                            target={social.isExternal ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: bgColor,
                                color: iconColor,
                                borderRadius: `${borderRadius}px`,
                                fontSize: `${fontSize}px`,
                                width: `${fontSize + 16}px`,
                                height: `${fontSize + 16}px`,
                                margin: '5px',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <i className={social.iconClass}></i>
                            {showName && (
                                <span
                                    style={{
                                        marginLeft: '8px',
                                        fontSize: '14px',
                                        color: iconColor,
                                    }}
                                >
                                    {social.name}
                                </span>
                            )}
                        </a>
                    ))}

                    {enableShareButton && (
                        <a
                            href="#"
                            title="Share Current Page"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: bgColor,
                                color: iconColor,
                                borderRadius: `${borderRadius}px`,
                                fontSize: `${fontSize}px`,
                                width: `${fontSize + 16}px`,
                                height: `${fontSize + 16}px`,
                                margin: '5px',
                                textDecoration: 'none',
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                const url = encodeURIComponent(window.location.href);
                                const text = encodeURIComponent(document.title);
                                window.open(
                                    `https://www.facebook.com/sharer/sharer.php?u=${url}&text=${text}`,
                                    '_blank'
                                );
                            }}
                        >
                            <i className="fa-solid fa-share-nodes"></i>
                        </a>
                    )}
                </div>
            </div>
        );
    },
});
