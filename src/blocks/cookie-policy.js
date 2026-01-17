import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps,
    InnerBlocks,
    InspectorControls
} from '@wordpress/block-editor';
import {
    PanelBody,
    RangeControl,
    SelectControl,
    ColorPalette
} from '@wordpress/components';

registerBlockType('themidev/cookie-policy', {
    title: 'Cookie Policy Block (ThemiDev)',
    icon: 'shield',
    category: 'widgets',

    attributes: {
        position: { type: 'string', default: 'bottom' }, // bottom or top
        bgColor: { type: 'string', default: '#222' },
        textColor: { type: 'string', default: '#fff' },
        autoHideTime: { type: 'number', default: 0 } // seconds to auto-hide, 0 = never
    },

    edit: ({ attributes, setAttributes }) => {
        const { position, bgColor, textColor, autoHideTime } = attributes;

        const blockProps = useBlockProps({
            className: 'themidev-cookie-block',
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
                    <PanelBody title="Cookie Banner Settings" initialOpen={true}>
                        <SelectControl
                            label="Banner Position"
                            value={position}
                            options={[
                                { label: 'Bottom', value: 'bottom' },
                                { label: 'Top', value: 'top' },
                            ]}
                            onChange={(val) => setAttributes({ position: val })}
                        />

                        <p><strong>Background Color</strong></p>
                        <ColorPalette
                            value={bgColor}
                            onChange={(val) => setAttributes({ bgColor: val })}
                        />

                        <p><strong>Text Color</strong></p>
                        <ColorPalette
                            value={textColor}
                            onChange={(val) => setAttributes({ textColor: val })}
                        />

                        <RangeControl
                            label="Auto Hide Time (seconds)"
                            help="0 = never auto-hide"
                            value={autoHideTime}
                            onChange={(val) => setAttributes({ autoHideTime: val })}
                            min={0}
                            max={60}
                        />
                    </PanelBody>
                </InspectorControls>

                <h3>🍪 Cookie Policy Banner</h3>
                <p style={{ fontSize: '13px', color: '#555' }}>
                    Add your cookie policy message, buttons, or links below.
                </p>

                <div
                    style={{
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        padding: '15px',
                        minHeight: '100px',
                        background: '#fafafa',
                    }}
                >
                    <InnerBlocks
                        template={[
                            [
                                'core/paragraph',
                                {
                                    placeholder: 'We use cookies to improve your experience...',
                                },
                            ],
                            [
                                'core/button',
                                {
                                    text: 'Accept',
                                },
                            ],
                        ]}
                        templateLock={false}
                    />
                </div>
            </div>
        );
    },

    save: ({ attributes }) => {
        const { position, bgColor, textColor, autoHideTime } = attributes;

        const blockProps = useBlockProps.save({
            className: `themidev-cookie-block position-${position}`,
        });

        return (
            <div {...blockProps}>
                <div
                    id="wab-cookie-banner"
                    className="wab-cookie-banner"
                    style={{
                        position: 'fixed',
                        [position]: 0,
                        left: 0,
                        width: '100%',
                        backgroundColor: bgColor,
                        color: textColor,
                        padding: '15px 20px',
                        textAlign: 'center',
                        zIndex: 9999,
                        display: 'none',
                        boxShadow:
                            position === 'top'
                                ? '0 2px 8px rgba(0,0,0,0.2)'
                                : '0 -2px 8px rgba(0,0,0,0.2)',
                    }}
                >
                    <div className="wab-cookie-inner">
                        <InnerBlocks.Content />
                        <button
                            id="wab-cookie-accept"
                            style={{
                                marginLeft: '10px',
                                background: '#0073aa',
                                color: '#fff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Accept
                        </button>
                    </div>
                </div>

                {/* Cookie Consent Logic */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        (function(){
                            const banner = document.getElementById('wab-cookie-banner');
                            const btn = document.getElementById('wab-cookie-accept');
                            const autoHide = ${autoHideTime};
                            if (localStorage.getItem('wab_cookie_accept')) return;

                            banner.style.display = 'block';

                            btn.addEventListener('click', () => {
                                localStorage.setItem('wab_cookie_accept', 'true');
                                banner.style.display = 'none';
                            });

                            if (autoHide > 0) {
                                setTimeout(() => {
                                    banner.style.display = 'none';
                                    localStorage.setItem('wab_cookie_accept', 'true');
                                }, autoHide * 1000);
                            }
                        })();
                    `,
                    }}
                ></script>
            </div>
        );
    },
});
