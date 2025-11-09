import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import $ from 'jquery';
import { __ } from '@wordpress/i18n';

registerBlockType('web-advisor/latest-blog-posts', {
  title: __('Latest Blog Posts (Web Advisor)', 'web-advisor'),
  icon: 'slides',
  category: 'widgets',
  attributes: {
    slidesDesktop: { type: 'number', default: 3 },
    slidesTablet: { type: 'number', default: 2 },
    slidesMobile: { type: 'number', default: 1 },
    autoplay: { type: 'boolean', default: true },
    loop: { type: 'boolean', default: true },
    margin: { type: 'number', default: 20 },
    showNav: { type: 'boolean', default: true },
    showDots: { type: 'boolean', default: true },
    autoplayTimeout: { type: 'number', default: 4000 },
  },

  edit: ({ attributes, setAttributes }) => {
    const {
      slidesDesktop,
      slidesTablet,
      slidesMobile,
      autoplay,
      loop,
      margin,
      showNav,
      showDots,
      autoplayTimeout,
    } = attributes;

    const blockProps = useBlockProps({ className: 'wa-latest-blog' });
    const carouselRef = useRef(null);
    const [posts, setPosts] = useState([]);

    // ✅ Always fetch 9 latest posts
    const allPosts = useSelect(
      (select) => {
        try {
          return select('core').getEntityRecords('postType', 'post', {
            per_page: 9,
            _embed: true,
          });
        } catch (e) {
          console.error('useSelect error', e);
          return [];
        }
      },
      []
    );

    useEffect(() => {
      if (Array.isArray(allPosts) && allPosts.length > 0) setPosts(allPosts);
    }, [allPosts]);

    const reInitCarousel = () => {
      const $carousel = $(carouselRef.current);
      if (!$carousel.length || typeof $.fn.owlCarousel !== 'function') return;

      try {
        $carousel.trigger('destroy.owl.carousel');
        $carousel.removeClass('owl-loaded');
        $carousel.find('.owl-stage-outer').children().unwrap();

        const totalPosts = posts.length;

        $carousel.owlCarousel({
          items: slidesDesktop,
          margin,
          loop: totalPosts > slidesDesktop ? loop : false,
          autoplay,
          autoplayTimeout,
          nav: showNav,
          dots: showDots,
          navText: [
            '<i class="material-icons">chevron_left</i>',
            '<i class="material-icons">chevron_right</i>',
          ],
          responsive: {
            0: { items: slidesMobile },
            600: { items: slidesTablet },
            991: { items: slidesDesktop },
          },
        });
      } catch (e) {
        console.warn('OwlCarousel init error:', e);
      }
    };

    useEffect(() => {
      if (posts.length > 0) setTimeout(reInitCarousel, 500);
    }, [posts]);

    return (
      <div {...blockProps}>
        <InspectorControls>
          <PanelBody title="Carousel Settings" initialOpen={true}>
            <RangeControl
              label="Desktop Slides (≥ 991px)"
              value={slidesDesktop}
              min={1}
              max={6}
              onChange={(val) => setAttributes({ slidesDesktop: val })}
            />
            <RangeControl
              label="Tablet Slides (≤ 991px)"
              value={slidesTablet}
              min={1}
              max={5}
              onChange={(val) => setAttributes({ slidesTablet: val })}
            />
            <RangeControl
              label="Mobile Slides (≤ 600px)"
              value={slidesMobile}
              min={1}
              max={3}
              onChange={(val) => setAttributes({ slidesMobile: val })}
            />
            <RangeControl
              label="Margin (px)"
              value={margin}
              min={0}
              max={60}
              onChange={(val) => setAttributes({ margin: val })}
            />
            <RangeControl
              label="Autoplay Timeout (ms)"
              value={autoplayTimeout}
              min={1000}
              max={10000}
              step={500}
              onChange={(val) => setAttributes({ autoplayTimeout: val })}
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
              label="Show Navigation"
              checked={showNav}
              onChange={(val) => setAttributes({ showNav: val })}
            />
            <ToggleControl
              label="Show Dots"
              checked={showDots}
              onChange={(val) => setAttributes({ showDots: val })}
            />
            <Button
              variant="primary"
              style={{ marginTop: '10px' }}
              onClick={() => reInitCarousel()}
            >
              🔄 Refresh Carousel
            </Button>
          </PanelBody>
        </InspectorControls>

        {posts.length === 0 && <p>Loading latest posts…</p>}
        {posts.length > 0 && (
          <div className="wa-latest-carousel owl-carousel" ref={carouselRef}>
            {posts.map((post) => {
              const featured =
                post?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                'https://via.placeholder.com/800x500?text=No+Image';
              const title = post?.title?.rendered || 'Untitled';
              const author = post?._embedded?.['author']?.[0]?.name || 'Admin';
              const date = new Date(post.date).toLocaleDateString();

              return (
                <article key={post.id} className="wa-blog-card">
                  <img src={featured} alt={title} />
                  <div className="wa-card-content">
                    <h4 dangerouslySetInnerHTML={{ __html: title }}></h4>
                    <p className="wa-meta">
                      👤 {author} &nbsp; 🗓 {date}
                    </p>
                    <a
                      className="wa-readmore"
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read More →
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    );
  },

  save: () => null,
});
