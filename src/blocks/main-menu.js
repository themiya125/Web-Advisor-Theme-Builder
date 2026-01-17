import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps,
    InspectorControls,
    BlockControls,
    AlignmentToolbar,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { Fragment, useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

registerBlockType('themidev/menu-block', {
    title: 'Main Menu (ThemiDev)',
    icon: 'menu',
    category: 'layout',
    attributes: {
        menuId: { type: 'number', default: 0 },
        alignment: { type: 'string', default: 'center' },
    },
    supports: { html: false },

    edit: ({ attributes, setAttributes }) => {
        const { menuId, alignment } = attributes;
        const blockProps = useBlockProps({ style: { textAlign: alignment } });
        const [menus, setMenus] = useState([]);

        // Fetch WP menus
        useEffect(() => {
            apiFetch({ path: '/wp/v2/menus' }).then((data) => {
                setMenus(data);
            });
        }, []);

        const menuOptions = [
            { label: 'Select Menu', value: 0 },
            ...menus.map((menu) => ({
                label: menu.name,
                value: menu.id,
            })),
        ];

        return (
            <Fragment>
                <BlockControls>
                    <AlignmentToolbar
                        value={alignment}
                        onChange={(val) =>
                            setAttributes({ alignment: val || 'center' })
                        }
                    />
                </BlockControls>

                <InspectorControls>
                    <PanelBody title="Menu Settings" initialOpen={true}>
                        <SelectControl
                            label="Select Menu"
                            value={menuId}
                            options={menuOptions}
                            onChange={(value) =>
                                setAttributes({ menuId: parseInt(value, 10) })
                            }
                        />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    {menuId ? (
                        <p><strong>Menu selected:</strong> {menuOptions.find(m => m.value === menuId)?.label}</p>
                    ) : (
                        <p>Select a menu from block settings</p>
                    )}
                </div>
            </Fragment>
        );
    },

    save: () => {
        // Dynamic block → rendered by PHP
        return null;
    },
});
