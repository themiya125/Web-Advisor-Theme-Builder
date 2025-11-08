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
   Load Owl Carousel Styles in Editor
----------------------------- */
const loadOwlStylesForEditor = () => {
    if (!document.querySelector('#owl-carousel-css')) {
        const link = document.createElement('link');
        link.id = 'owl-carousel-css';
        link.rel = 'stylesheet';
        link.href =
            'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css';
        document.head.appendChild(link);
    }
    if (!document.querySelector('#owl-carousel-theme-css')) {
        const link = document.createElement('link');
        link.id = 'owl-carousel-theme-css';
        link.rel = 'stylesheet';
        link.href =
            'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css';
        document.head.appendChild(link);
    }
};

/* -----------------------------
   Block Registration
----------------------------- */
registerBlockType('web-advisor/owl-simple-slider', {
    title: 'Owl Simple Slider (Web Advisor)',
    icon: 'images-alt2',
    category: 'layout',
    attributes: {
        slides: { type: 'array', default: [] },
        transitionEffect: { type: 'string', default: 'slide' }, // slide | fade
        slidesDesktop: { type: 'number', default: 3 },
        slidesTablet: { type: 'number', default: 2 }, // tablet <= 991px
        slidesMobile: { type: 'number', default: 1 },
        autoplay: { type: 'boolean', default: false },
        loop: { type: 'boolean', default: true },
        autoplayTimeout: { type: 'number', default: 5000 },
        showDots: { type: 'boolean', default: true },
        showNav: { type: 'boolean', default: true },
    },

    edit: ({ attributes, setAttributes }) => {
        const {
            slides,
            transitionEffect,
            slidesDesktop,
            slidesTablet,
            slidesMobile,
            autoplay,
            loop,
            autoplayTimeout,
            showDots,
            showNav,
        } = attributes;

        loadOwlStylesForEditor();

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
            updated[index] = { ...updated[index], [key]: value };
            setAttributes({ slides: updated });
        };

        const removeSlide = (index) => {
            const updated = slides.filter((_, i) => i !== index);
            setAttributes({ slides: updated });
        };

        return (
            <div {...useBlockProps()} className="web-advisor-owl-slider-edit">
                <InspectorControls>
                    <PanelBody title="Slider Settings" initialOpen={true}>
                        <Button
                            isPrimary
                            onClick={addSlide}
                            style={{ marginBottom: '10px' }}
                        >
                            + Add New Slide
                        </Button>

                        <RangeControl
                            label="Slides (Desktop)"
                            value={slidesDesktop}
                            onChange={(val) => setAttributes({ slidesDesktop: val })}
                            min={1}
                            max={6}
                        />
                        <RangeControl
                            label="Slides (Tablet ≤ 991px)"
                            value={slidesTablet}
                            onChange={(val) => setAttributes({ slidesTablet: val })}
                            min={1}
                            max={6}
                        />
                        <RangeControl
                            label="Slides (Mobile)"
                            value={slidesMobile}
                            onChange={(val) => setAttributes({ slidesMobile: val })}
                            min={1}
                            max={6}
                        />

                        <SelectControl
                            label="Transition Effect"
                            value={transitionEffect}
                            options={[
                                { label: 'Slide (Default)', value: 'slide' },
                                { label: 'Fade', value: 'fade' },
                            ]}
                            onChange={(val) => setAttributes({ transitionEffect: val })}
                        />

                        <ToggleControl
                            label="Autoplay"
                            checked={autoplay}
                            onChange={(val) => setAttributes({ autoplay: val })}
                        />

                        <ToggleControl
                            label="Loop"
                            checked={loop}
                            onChange={(val) => setAttributes({ loop: val })}
                        />

                        <RangeControl
                            label="Autoplay timeout (ms)"
                            value={autoplayTimeout}
                            onChange={(val) => setAttributes({ autoplayTimeout: val })}
                            min={1000}
                            max={10000}
                            step={500}
                        />

                        <ToggleControl
                            label="Show Dots"
                            checked={showDots}
                            onChange={(val) => setAttributes({ showDots: val })}
                        />

                        <ToggleControl
                            label="Show Navigation Arrows"
                            checked={showNav}
                            onChange={(val) => setAttributes({ showNav: val })}
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
                                <p><strong>Slide {index + 1}</strong></p>

                                <MediaUploadCheck>
                                    <MediaUpload
                                        onSelect={(media) => updateSlide(index, 'image', media.url)}
                                        allowedTypes={['image']}
                                        render={({ open }) => (
                                            <div>
                                                {slide.image && (
                                                    <div style={{ marginBottom: '10px', textAlign: 'center' }}>
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
                                                <Button onClick={open} isSecondary style={{ marginBottom: '10px' }}>
                                                    {slide.image ? 'Change Image' : 'Upload Image'}
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

                                <Button
                                    isDestructive
                                    onClick={() => removeSlide(index)}
                                    style={{ marginTop: '10px', background: '#dc3232', color: '#fff' }}
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
                    <p>Owl Slider Preview — {transitionEffect.toUpperCase()} Transition</p>
                    {slides.length === 0 && <p>No slides added yet.</p>}
                    {slides.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingTop: '10px' }}>
                            {slides.map((slide, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '180px',
                                        height: '120px',
                                        background: '#333',
                                        border: '1px solid #555',
                                        borderRadius: '5px',
                                        backgroundImage: slide.image ? `url(${slide.image})` : 'none',
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
        const {
            slides,
            transitionEffect,
            slidesDesktop,
            slidesTablet,
            slidesMobile,
            autoplay,
            loop,
            autoplayTimeout,
            showDots,
            showNav,
        } = attributes;

        const blockProps = useBlockProps.save();

        return (
            <div {...blockProps}>
                <div
                    className="web-advisor-owl-carousel owl-theme"
                    data-slides-desktop={slidesDesktop}
                    data-slides-tablet={slidesTablet}
                    data-slides-mobile={slidesMobile}
                    data-transition={transitionEffect}
                    data-autoplay={autoplay ? 'true' : 'false'}
                    data-loop={loop ? 'true' : 'false'}
                    data-autoplay-timeout={autoplayTimeout}
                    data-show-dots={showDots ? 'true' : 'false'}
                    data-show-nav={showNav ? 'true' : 'false'}
                >
                    {slides.map((slide, index) => (
                        <div
                            className="item web-advisor-slide"
                            key={index}
                            style={{
                                backgroundImage: slide.image ? `url(${slide.image})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                minHeight: '500px',
                                position: 'relative',
                                color: '#fff',
                            }}
                        >
                            <div
                                className="web-advisor-slide-inner"
                                style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '80%',
                                    maxWidth: '1100px',
                                    textAlign: 'center',
                                    background: 'rgba(0,0,0,0.35)',
                                    padding: '20px',
                                    borderRadius: '8px',
                                }}
                            >
                                <h2>{slide.title}</h2>
                                <p>{slide.subtitle}</p>
                                {slide.buttonText && (
                                    <a
                                        href={slide.buttonUrl || '#'}
                                        target={slide.isExternal ? '_blank' : undefined}
                                        rel={slide.isExternal ? 'noopener noreferrer' : undefined}
                                        style={{
                                            display: 'inline-block',
                                            padding: '10px 18px',
                                            background: '#0d6efd',
                                            color: '#fff',
                                            borderRadius: '4px',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        {slide.buttonText}
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Owl Carousel CDN */}
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css"
                />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css"
                />
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"></script>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
(function(){
    function initOwl() {
        var sliders = document.querySelectorAll('.web-advisor-owl-carousel');
        if (!sliders.length) return;
        if (typeof jQuery === 'undefined' || !jQuery.fn.owlCarousel) {
            setTimeout(initOwl, 250);
            return;
        }
        sliders.forEach(function(slider){
            if (slider.classList.contains('owl-initialized')) return;
            var desktop = parseInt(slider.dataset.slidesDesktop) || 3;
            var tablet = parseInt(slider.dataset.slidesTablet) || 2;
            var mobile = parseInt(slider.dataset.slidesMobile) || 1;
            var transition = slider.dataset.transition || 'slide';
            var autoplay = slider.dataset.autoplay === 'true';
            var loop = slider.dataset.loop === 'true';
            var autoplayTimeout = parseInt(slider.dataset.autoplayTimeout) || 5000;
            var showDots = slider.dataset.showDots === 'true';
            var showNav = slider.dataset.showNav === 'true';
            var animateOut = (transition === 'fade') ? 'fadeOut' : '';
            jQuery(slider).owlCarousel({
                items: desktop,
                loop: loop,
                margin: 0,
                autoplay: autoplay,
                autoplayTimeout: autoplayTimeout,
                autoplayHoverPause: true,
                dots: showDots,
                nav: showNav,
                responsive: {
                    0: { items: mobile },
                    768: { items: tablet },
                    991: { items: tablet },
                    1200: { items: desktop }
                },
                animateOut: animateOut
            });
        });
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initOwl();
    } else {
        document.addEventListener('DOMContentLoaded', initOwl);
    }
})();`
                    }}
                />
            </div>
        );
    },
});
