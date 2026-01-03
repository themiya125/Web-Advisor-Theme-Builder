import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps,
    InnerBlocks,
    InspectorControls
} from '@wordpress/block-editor';
import {
    PanelBody,
    RangeControl,
    ToggleControl
} from '@wordpress/components';

registerBlockType('web-advisor/popup-banner', {
    title: 'Pop-up Banner Block (Web Advisor)',
    icon: 'visibility',
    category: 'widgets',

    attributes: {
        delayTime: { type: 'number', default: 3 }, // seconds before popup shows
        showOnce: { type: 'boolean', default: false } // show once per visitor
    },

    edit: ({ attributes, setAttributes }) => {
        const { delayTime, showOnce } = attributes;

        const blockProps = useBlockProps({
            className: 'themidev-pop-up',
            style: {
                border: '2px dashed #0073aa',
                padding: '20px',
                textAlign: 'center',
                borderRadius: '8px',
            },
        });

        return (
            <div {...blockProps}>
                <InspectorControls>
                    <PanelBody title="Popup Settings" initialOpen={true}>
                        <RangeControl
                            label="Delay Time (seconds)"
                            value={delayTime}
                            onChange={(val) => setAttributes({ delayTime: val })}
                            min={1}
                            max={30}
                        />
                        <ToggleControl
                            label="Show only once per visitor (using localStorage)"
                            checked={showOnce}
                            onChange={(val) => setAttributes({ showOnce: val })}
                        />
                    </PanelBody>
                </InspectorControls>

                <h3 style={{ marginBottom: '10px' }}>🎉 Pop-up Banner Content</h3>
                <p style={{ color: '#555', fontSize: '13px' }}>
                    Add any inner blocks here — text, buttons, images, etc.
                </p>

                <div
                    style={{
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        padding: '15px',
                        minHeight: '150px',
                        background: '#fafafa',
                    }}
                >
                    <InnerBlocks />
                </div>

                <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                    (This popup will appear {delayTime} seconds after the page loads)
                </p>
            </div>
        );
    },

    save: ({ attributes }) => {
        const { delayTime, showOnce } = attributes;

        const blockProps = useBlockProps.save({
            className: 'themidev-pop-up',
        });

        return (
            <div {...blockProps}>
                {/* Popup Dialog */}
                <div
                    className="themidev-pop-up-dialog"
                    tabIndex="-1"
                    role="dialog"
                    style={{
                        display: 'none',
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 9999,
                        background: '#fff',
                        borderRadius: '10px',
                        padding: '15px',
                        boxShadow: '0 4px 25px rgba(0,0,0,0.4)',
                        maxWidth: '600px',
                        width: '90%',
                    }}
                >
                    <div className="themidev-pop-up-content">
                        <InnerBlocks.Content />
                    </div>
                    <button
                        type="button"
                        className="themidev-pop-up-close btn-close"
                        style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-5px',
                            fontSize: '25px',
                            background: '#ed2c2c',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer',
                            lineHeight: '0',
                            opacity:'1'
                        }}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                {/* Script to show popup after delay */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        (function(){
                            const delay = ${delayTime} * 1000;
                            const showOnce = ${showOnce};
                            const popup = document.querySelector('.wab-popup-dialog');
                            const closeBtn = popup.querySelector('.wab-popup-close');

                            function showPopup() {
                                if (!popup) return;
                                popup.style.display = 'block';
                                popup.classList.add('wab-fade-in');
                            }

                            if (showOnce && localStorage.getItem('wab_popup_seen')) return;
                            setTimeout(() => {
                                showPopup();
                                if (showOnce) localStorage.setItem('wab_popup_seen', 'true');
                            }, delay);

                            closeBtn.addEventListener('click', () => {
                                popup.style.display = 'none';
                            });
                        })();
                    `,
                    }}
                ></script>

                {/* Fade animation */}
                <style>
                    {`
                    .wab-fade-in {
                        animation: wabFadeIn 0.3s ease forwards;
                    }
                    @keyframes wabFadeIn {
                        from { opacity: 0; transform: translate(-50%, -45%); }
                        to { opacity: 1; transform: translate(-50%, -50%); }
                    }
                    `}
                </style>
            </div>
        );
    },
});
