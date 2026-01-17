/**
 * Owl Carousel Parent + Slide child block with Font Awesome nav icons
 */

import { registerBlockType } from '@wordpress/blocks';
import {
  useBlockProps,
  InnerBlocks,
  InspectorControls,
} from '@wordpress/block-editor';
import {
  PanelBody,
  RangeControl,
  ToggleControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/* ---------------------------
   Child: owl-carousel-slide
--------------------------- */
registerBlockType('themidev/owl-carousel-slide', {
  title: 'Owl Slide',
  icon: 'format-image',
  category: 'layout',
  parent: ['themidev/owl-carousel'],
  supports: { reusable: false },
  edit: () => {
    const blockProps = useBlockProps({
      style: {
        border: '1px dashed #ddd',
        padding: '12px',
        borderRadius: '6px',
        background: '#fff',
      },
    });

    return (
      <div {...blockProps}>
        <div style={{ fontSize: '13px', marginBottom: '8px', color: '#333' }}>
          🖼️ Slide content
        </div>
        <div
          style={{
            border: '1px dashed #eee',
            padding: '8px',
            borderRadius: '4px',
          }}
        >
          <InnerBlocks
            allowedBlocks={[
              'core/paragraph',
              'core/image',
              'core/heading',
              'core/buttons',
              'core/button',
              'core/list',
              'core/cover',
              'themidev/div-block',
            ]}
            templateLock={false}
          />
        </div>
      </div>
    );
  },
  save: () => {
    const blockProps = useBlockProps.save();
    return (
      <div {...blockProps} className="themidev-owl-slide">
        <InnerBlocks.Content />
      </div>
    );
  },
});

/* ---------------------------
   Parent: owl-carousel
--------------------------- */
registerBlockType('themidev/owl-carousel', {
  title: 'Owl Carousel Slider (ThemiDev)',
  icon: 'images-alt2',
  category: 'layout',
  attributes: {
    itemsDesktop: { type: 'number', default: 3 },
    itemsTablet: { type: 'number', default: 2 },
    itemsMobile: { type: 'number', default: 1 },
    autoplay: { type: 'boolean', default: true },
    loop: { type: 'boolean', default: true },
    margin: { type: 'number', default: 10 },
    autoplayTimeout: { type: 'number', default: 3000 },
    showNav: { type: 'boolean', default: true },
    showDots: { type: 'boolean', default: true },
  },

  edit: ({ attributes, setAttributes }) => {
    const {
      itemsDesktop,
      itemsTablet,
      itemsMobile,
      autoplay,
      loop,
      margin,
      autoplayTimeout,
      showNav,
      showDots,
    } = attributes;

    const parentBlockProps = useBlockProps({
      className: 'themidev-owl-parent',
      style: {
        border: '2px dashed #0073aa',
        padding: '12px',
        borderRadius: '6px',
      },
    });

    return (
      <div {...parentBlockProps}>
        <InspectorControls>
          <PanelBody title="Carousel Settings" initialOpen={true}>
            <RangeControl
              label="Items on Desktop (≥992px)"
              value={itemsDesktop}
              onChange={(val) => setAttributes({ itemsDesktop: val })}
              min={1}
              max={6}
            />
            <RangeControl
              label="Items on Tablet (≤991px)"
              value={itemsTablet}
              onChange={(val) => setAttributes({ itemsTablet: val })}
              min={1}
              max={5}
            />
            <RangeControl
              label="Items on Mobile (≤767px)"
              value={itemsMobile}
              onChange={(val) => setAttributes({ itemsMobile: val })}
              min={1}
              max={3}
            />
            <RangeControl
              label="Margin between slides (px)"
              value={margin}
              onChange={(val) => setAttributes({ margin: val })}
              min={0}
              max={50}
            />
            <RangeControl
              label="Autoplay Timeout (ms)"
              value={autoplayTimeout}
              onChange={(val) => setAttributes({ autoplayTimeout: val })}
              min={500}
              max={10000}
              step={100}
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
            <ToggleControl
              label="Show Navigation Arrows"
              checked={showNav}
              onChange={(val) => setAttributes({ showNav: val })}
            />
            <ToggleControl
              label="Show Dots"
              checked={showDots}
              onChange={(val) => setAttributes({ showDots: val })}
            />
          </PanelBody>
        </InspectorControls>

        <div style={{ marginBottom: '10px', fontSize: '14px' }}>
          🦉 Owl Carousel — add slides using the block inserter (inside the carousel).
        </div>

        <div
          style={{
            background: '#f8f9fa',
            padding: '8px',
            borderRadius: '4px',
          }}
        >
          <InnerBlocks
            allowedBlocks={['themidev/owl-carousel-slide']}
            templateLock={false}
            renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
          />
        </div>

        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          Each slide is independent — click a slide to edit its content.
        </div>
      </div>
    );
  },

  save: ({ attributes }) => {
    const {
      itemsDesktop,
      itemsTablet,
      itemsMobile,
      autoplay,
      loop,
      margin,
      autoplayTimeout,
      showNav,
      showDots,
    } = attributes;

    const blockProps = useBlockProps.save();

    return (
      <div {...blockProps}>
        <div
          className="owl-carousel themidev-owl-carousel"
          data-items-desktop={itemsDesktop}
          data-items-tablet={itemsTablet}
          data-items-mobile={itemsMobile}
          data-autoplay={autoplay}
          data-loop={loop}
          data-margin={margin}
          data-autoplay-timeout={autoplayTimeout}
          data-show-nav={showNav}
          data-show-dots={showDots}
        >
          <InnerBlocks.Content />
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function($){
              $(document).ready(function(){
                $('.themidev-owl-carousel').each(function(){
                  var $carousel = $(this);
                  var desktop = parseInt($carousel.data('items-desktop')) || 3;
                  var tablet = parseInt($carousel.data('items-tablet')) || 2;
                  var mobile = parseInt($carousel.data('items-mobile')) || 1;
                  var autoplay = $carousel.data('autoplay') == true || $carousel.data('autoplay') == 'true';
                  var loop = $carousel.data('loop') == true || $carousel.data('loop') == 'true';
                  var margin = parseInt($carousel.data('margin')) || 10;
                  var autoplayTimeout = parseInt($carousel.data('autoplay-timeout')) || 3000;
                  var showNav = $carousel.data('show-nav') == true || $carousel.data('show-nav') == 'true';
                  var showDots = $carousel.data('show-dots') == true || $carousel.data('show-dots') == 'true';

                  if (typeof $carousel.owlCarousel !== 'function') {
                    console.warn('🦉 Owl Carousel not loaded.');
                    return;
                  }

                  $carousel.owlCarousel({
                    items: desktop,
                    margin: margin,
                    loop: loop,
                    autoplay: autoplay,
                    autoplayTimeout: autoplayTimeout,
                    nav: showNav,
                    dots: showDots,
                    navText: [
                      '<i class="fa-solid fa-chevron-left"></i>',
                      '<i class="fa-solid fa-chevron-right"></i>'
                    ],
                    responsive:{
                      0:{ items: mobile },
                      768:{ items: tablet },
                      992:{ items: desktop }
                    },
                    onInitialized: function(){
                      if (showNav) {
                        $carousel.find('.owl-nav').css({
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                          position: 'absolute',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 10
                        });
                        $carousel.find('.owl-prev, .owl-next').css({
                          background: 'rgba(0,0,0,0.4)',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          cursor: 'pointer'
                        });
                      }
                    }
                  });

                  // ✅ Force show nav even if one slide
                  if (showNav) {
                    $carousel.find('.owl-nav').show();
                  }
                });
              });
            })(jQuery);
            `,
          }}
        ></script>
      </div>
    );
  },
});
