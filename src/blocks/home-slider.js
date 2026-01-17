import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps,
    InspectorControls,
    MediaUpload,
    MediaUploadCheck
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    TextControl,
    ToggleControl,
    SelectControl,
    RangeControl
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/* -----------------------------
   Home Page Slider Block
----------------------------- */

registerBlockType('themidev/home-slider', {
    title: 'Home Page Slider (ThemiDev)',
    icon: 'images-alt2',
    category: 'layout',
    attributes: {
        slides: { type: 'array', default: [] },
        transitionEffect: { type: 'string', default: 'slide' }, // slide | fade
        navIconStyle: { type: 'string', default: 'bootstrap' }, // bootstrap | material | fontawesome
        autoplayTimeout: { type: 'number', default: 5000 }, // added new attribute
    },

    edit: ({ attributes, setAttributes }) => {
        const { slides, transitionEffect, navIconStyle, autoplayTimeout } = attributes;

        const addSlide = () => {
            const newSlide = {
                title: 'Main Title',
                subtitle: 'Sub Title',
                buttonText: 'Learn More',
                buttonUrl: '',
                isExternal: false,
                image: '',
            };
            setAttributes({ slides: [newSlide, ...slides] });
        };

        const updateSlide = (index, key, value) => {
            const updated = [...slides];
            updated[index][key] = value;
            setAttributes({ slides: updated });
        };

        const removeSlide = (index) => {
            const updated = slides.filter((_, i) => i !== index);
            setAttributes({ slides: updated });
        };

        return (
            <div {...useBlockProps()} className="themidev-slider-edit">
                <InspectorControls>
                    <PanelBody title="Slider Settings" initialOpen={true}>
                        {/* Add Slide Button */}
                        <Button
                            isPrimary
                            onClick={addSlide}
                            style={{ marginBottom: '10px' }}
                        >
                            + Add New Slide
                        </Button>

                        {/* Transition Effect */}
                        <SelectControl
                            label="Transition Effect"
                            value={transitionEffect}
                            options={[
                                { label: 'Slide (Default)', value: 'slide' },
                                { label: 'Fade', value: 'fade' },
                            ]}
                            onChange={(val) => setAttributes({ transitionEffect: val })}
                        />

                        {/* Navigation Icon Style */}
                        <SelectControl
                            label="Navigation Icon Style"
                            value={navIconStyle}
                            options={[
                                { label: 'Bootstrap Default', value: 'bootstrap' },
                                { label: 'Google Material Icons', value: 'material' },
                                { label: 'Font Awesome', value: 'fontawesome' },
                            ]}
                            onChange={(val) => setAttributes({ navIconStyle: val })}
                        />

                        {/* Autoplay Timeout */}
                        <RangeControl
                            label="Autoplay Timeout (ms)"
                            value={autoplayTimeout}
                            onChange={(val) => setAttributes({ autoplayTimeout: val })}
                            min={1000}
                            max={10000}
                            step={500}
                        />
                     

                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                style={{
                                    marginBottom: '25px',
                                    borderBottom: '1px solid #ddd',
                                    paddingBottom: '15px',
                                }}
                            >
                                <p>
                                    <strong>Slide {index + 1}</strong>
                                </p>

                                {/* Image Upload with Preview */}
                                <MediaUploadCheck>
                                    <MediaUpload
                                        onSelect={(media) =>
                                            updateSlide(index, 'image', media.url)
                                        }
                                        allowedTypes={['image']}
                                        render={({ open }) => (
                                            <div>
                                                {slide.image && (
                                                    <div
                                                        style={{
                                                            marginBottom: '10px',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        <img
                                                            src={slide.image}
                                                            alt="Slide preview"
                                                            style={{
                                                                maxWidth: '100%',
                                                                borderRadius: '5px',
                                                                border: '1px solid #ccc',
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <Button
                                                    onClick={open}
                                                    isSecondary
                                                    style={{ marginBottom: '10px' }}
                                                >
                                                    {slide.image
                                                        ? 'Change Image'
                                                        : 'Upload Image'}
                                                </Button>
                                            </div>
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
                                    onChange={(val) =>
                                        updateSlide(index, 'subtitle', val)
                                    }
                                />

                                <TextControl
                                    label="Button Text"
                                    value={slide.buttonText}
                                    onChange={(val) =>
                                        updateSlide(index, 'buttonText', val)
                                    }
                                />

                                <TextControl
                                    label="Button URL"
                                    value={slide.buttonUrl}
                                    onChange={(val) =>
                                        updateSlide(index, 'buttonUrl', val)
                                    }
                                />

                                <ToggleControl
                                    label="Open link in new tab"
                                    checked={slide.isExternal}
                                    onChange={(val) =>
                                        updateSlide(index, 'isExternal', val)
                                    }
                                />

                                <Button
                                    isDestructive
                                    onClick={() => removeSlide(index)}
                                    style={{
                                        marginTop: '10px',
                                        background: '#dc3232',
                                        color: '#fff',
                                    }}
                                >
                                    Remove Slide
                                </Button>
                            </div>
                        ))}
                    </PanelBody>
                </InspectorControls>

                {/* Editor Preview */}
                <div
                    className="themidev-slider-preview"
                    style={{
                        minHeight: '200px',
                        background: '#222',
                        color: '#fff',
                        padding: '20px',
                        textAlign: 'center',
                    }}
                >
                    <p>Slider Preview — {transitionEffect.toUpperCase()} Transition</p>
                    {slides.length === 0 && <p>No slides added yet.</p>}
                    {slides.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                            {slides.map((slide, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '120px',
                                        height: '80px',
                                        background: '#333',
                                        border: '1px solid #555',
                                        borderRadius: '5px',
                                        backgroundImage: slide.image
                                            ? `url(${slide.image})`
                                            : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                ></div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    },

    save: ({ attributes }) => {
        const { slides, transitionEffect, navIconStyle, autoplayTimeout } = attributes;
        const blockProps = useBlockProps.save();

        // Determine carousel classes based on transition effect
        const carouselClass =
            transitionEffect === 'fade'
                ? 'themidev-slider carousel slide carousel-fade'
                : 'themidev-slider carousel slide';

        // Icon HTML based on style
        const getPrevIcon = () => {
            switch (navIconStyle) {
                case 'material':
                    return '<span class="material-icons" style="font-size:32px;">arrow_back</span>';
                case 'fontawesome':
                    return '<i class="fa-solid fa-chevron-left" style="font-size:28px;"></i>';
                default:
                    return '<span class="carousel-control-prev-icon" aria-hidden="true"></span>';
            }
        };

        const getNextIcon = () => {
            switch (navIconStyle) {
                case 'material':
                    return '<span class="material-icons" style="font-size:32px;">arrow_forward</span>';
                case 'fontawesome':
                    return '<i class="fa-solid fa-chevron-right" style="font-size:28px;"></i>';
                default:
                    return '<span class="carousel-control-next-icon" aria-hidden="true"></span>';
            }
        };

        return (
            <div {...blockProps}>
                <div
                    id="themidevBootstrapCarousel"
                    className={carouselClass}
                    data-bs-ride="carousel"
                    data-bs-interval={autoplayTimeout}
                >
                    {/* Carousel Indicators */}
                    <div className="carousel-indicators">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target="themidevBootstrapCarousel"
                                data-bs-slide-to={index}
                                className={index === 0 ? 'active' : ''}
                                aria-current={index === 0 ? 'true' : undefined}
                                aria-label={`Slide ${index + 1}`}
                            ></button>
                        ))}
                    </div>

                    {/* Carousel Inner */}
                    <div className="carousel-inner">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`carousel-item ${
                                    index === 0 ? 'active' : ''
                                }`}
                                style={{
                                    backgroundImage: `url(${slide.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    minHeight: '550px',
                                    position: 'relative',
                                    color: '#fff',
                                }}
                            >
                                <div
                                    className="carousel-caption d-flex flex-column justify-content-center"
                                    style={{
                                        background: 'rgba(0,0,0,0.4)',
                                        padding: '20px',
                                        borderRadius: '10px',
                                    }}
                                >
                                    <h2>{slide.title}</h2>
                                    <p>{slide.subtitle}</p>
                                    {slide.buttonText && (
                                        <a
                                            href={slide.buttonUrl || '#'}
                                            target={
                                                slide.isExternal ? '_blank' : undefined
                                            }
                                            rel={
                                                slide.isExternal
                                                    ? 'noopener noreferrer'
                                                    : undefined
                                            }
                                            className="btn btn-primary"
                                        >
                                            {slide.buttonText}
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Controls */}
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#themidevBootstrapCarousel"
                        data-bs-slide="prev"
                        dangerouslySetInnerHTML={{ __html: getPrevIcon() }}
                    />
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#themidevBootstrapCarousel"
                        data-bs-slide="next"
                        dangerouslySetInnerHTML={{ __html: getNextIcon() }}
                    />
                </div>
            </div>
        );
    },
});
