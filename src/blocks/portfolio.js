import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

registerBlockType("web-advisor/portfolio-grid", {
    title: __("Portfolio Grid (Web Advisor)", "web-advisor"),
    icon: "images-alt2",
    category: "widgets",

    attributes: {
        showFilters: { type: "boolean", default: true },
        viewMoreLabel: { type: "string", default: "View More" },
        viewMoreLink: { type: "string", default: "/portfolio" },
    },

    edit: ({ attributes, setAttributes }) => {
        const { showFilters, viewMoreLabel, viewMoreLink } = attributes;
        const blockProps = useBlockProps({ className: "themidev-portfolio-block" });

        const [activeCat, setActiveCat] = useState("all");
        const [filtered, setFiltered] = useState([]);

        const categories = useSelect((select) =>
            select("core").getEntityRecords("taxonomy", "portfolio_category", { per_page: -1 })
        );

        const portfolios = useSelect((select) =>
            select("core").getEntityRecords("postType", "portfolio", { per_page: -1, _embed: true })
        );

        useEffect(() => {
            if (portfolios) setFiltered(portfolios.slice(0, 6));
        }, [portfolios]);

        const filterByCategory = (catSlug) => {
            setActiveCat(catSlug);

            if (catSlug === "all") {
                setFiltered(portfolios.slice(0, 6));
            } else {
                setFiltered(
                    portfolios.filter((p) =>
                        p._embedded?.["wp:term"]?.[0]?.some((t) => t.slug === catSlug)
                    )
                );
            }
        };

        return (
            <div {...blockProps}>
                <InspectorControls>

                    {/* === Portfolio Settings === */}
                    <PanelBody title="Portfolio Settings" initialOpen={true}>
                        <ToggleControl
                            label="Show Category Filters"
                            checked={showFilters}
                            onChange={(val) => setAttributes({ showFilters: val })}
                        />

                        <TextControl
                            label="View More Button Label"
                            value={viewMoreLabel}
                            onChange={(val) => setAttributes({ viewMoreLabel: val })}
                        />

                        <TextControl
                            label="View More Link URL"
                            value={viewMoreLink}
                            onChange={(val) => setAttributes({ viewMoreLink: val })}
                        />
                    </PanelBody>

                    {/* === NEW SHORTCODE PANEL === */}
                    <PanelBody title="Shortcode for Single Portfolio" initialOpen={false}>
                        <p style={{ marginBottom: "8px", fontSize: "13px" }}>
                            Use the shortcode below to display a single portfolio item on any page:
                        </p>

                        <TextControl
                            label="Copy Shortcode"
                            value="[portfolio_single]"
                            readOnly
                        />

                        <p style={{ marginTop: "8px", fontSize: "12px", opacity: 0.7 }}>
                            Add this shortcode to your Portfolio Page or Single Template.
                        </p>
                    </PanelBody>

                </InspectorControls>

                {/* === FILTER BUTTONS === */}
                {showFilters && (
                    <div className="themidev-portfolio-filters">
                        <button
                            className={`filter-btn ${activeCat === "all" ? "active" : ""}`}
                            onClick={() => filterByCategory("all")}
                        >
                            All
                        </button>

                        {categories &&
                            categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    className={`filter-btn ${activeCat === cat.slug ? "active" : ""}`}
                                    onClick={() => filterByCategory(cat.slug)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                    </div>
                )}

                {/* === PORTFOLIO GRID === */}
                <div className="wa-portfolio-grid">
                    {!filtered && <p>Loading portfolio items…</p>}

                    {filtered &&
                        filtered.slice(0, 6).map((item) => {
                            const img =
                                item._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                                "https://via.placeholder.com/600x400";

                            return (
                                <div key={item.id} className="themidev-portfolio-card">
                                    <div className="wa-thumb">
                                        <img src={img} alt={item.title.rendered} />

                                        <span className="wa-badge">
                                            {item._embedded?.["wp:term"]?.[0]?.[0]?.name || "Design"}
                                        </span>
                                    </div>

                                    <h4
                                        className="wa-title"
                                        dangerouslySetInnerHTML={{ __html: item.title.rendered }}
                                    ></h4>

                                    <a href={item.link} className="wa-btn">
                                        View Project <span className="material-icons">arrow_forward</span>
                                    </a>
                                </div>
                            );
                        })}
                </div>

                {/* === VIEW MORE BUTTON === */}
                <div className="wa-loadmore">
                    <a href={viewMoreLink} className="wa-more-btn">
                        {viewMoreLabel}
                    </a>
                </div>
            </div>
        );
    },

    save: () => null,
});
