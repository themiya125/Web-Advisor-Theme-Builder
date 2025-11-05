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
    ToggleControl
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/* -----------------------------
   Home Page Slider Block
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

        const removeSlide = (index) => {
            const updated = slides.filter((_, i) => i !== index);
            setAttributes({ slides: updated });
        };

        return (
            <div {...useBlockProps()} className="web-advisor-slider-edit">
                <InspectorControls>
                    <PanelBody title="Slider Settings" initialOpen={true}>
                        <Button
                            isPrimary
                            onClick={addSlide}
                            style={{ marginBottom: '10px' }}
                        >
                            + Add New Slide
                        </Button>

                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                style={{
                                    marginBottom: '20px',
                                    borderBottom: '1px solid #ddd',
                                    paddingBottom: '10px',
                                }}
                            >
                                <p>
                                    <strong>Slide {index + 1}</strong>
                                </p>

                                <MediaUploadCheck>
                                    <MediaUpload
                                        onSelect={(media) =>
                                            updateSlide(index, 'image', media.url)
                                        }
                                        allowedTypes={['image']}
                                        render={({ open }) => (
                                            <Button
                                                onClick={open}
                                                isSecondary
                                                style={{ marginBottom: '10px' }}
                                            >
                                                {slide.image
                                                    ? 'Change Image'
                                                    : 'Upload Image'}
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
                    className="web-advisor-slider-preview"
                    style={{
                        minHeight: '200px',
                        background: '#222',
                        color: '#fff',
                        padding: '20px',
                        textAlign: 'center',
                    }}
                >
                    <p>Bootstrap Carousel Preview (Front-end View)</p>
                    {slides.length === 0 && <p>No slides added yet.</p>}
                </div>
            </div>
        );
    },

    save: ({ attributes }) => {
        const { slides } = attributes;
        const blockProps = useBlockProps.save();

        return (
            <div {...blockProps}>
                <div
                    id="wabBootstrapCarousel"
                    className="web-advisor-slider carousel slide"
                    data-bs-ride="carousel"
                    data-bs-interval="3000"
                >
                    {/* Carousel Indicators */}
                    <div className="carousel-indicators">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target="#wabBootstrapCarousel"
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
                                    minHeight: '400px',
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
                        data-bs-target="#wabBootstrapCarousel"
                        data-bs-slide="prev"
                    >
                        <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Previous</span>
                    </button>

                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#wabBootstrapCarousel"
                        data-bs-slide="next"
                    >
                        <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>

                {/* Bootstrap CDN */}
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                />
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
            </div>
        );
    },
});
