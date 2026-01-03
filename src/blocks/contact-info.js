import { registerBlockType } from '@wordpress/blocks';
import {
  useBlockProps,
  InspectorControls,
  RichText,
} from '@wordpress/block-editor';
import {
  PanelBody,
  Button,
  TextControl,
  RangeControl,
  ColorPalette,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

registerBlockType('web-advisor/contact-info', {
  title: 'Contact Info Block (Web Advisor)',
  icon: 'phone',
  category: 'widgets',

  attributes: {
    contacts: { type: 'array', default: [] },
    fontSize: { type: 'number', default: 16 },
    color: { type: 'string', default: '#000000' },
    hoverColor: { type: 'string', default: '#0073aa' },
  },

  edit: ({ attributes, setAttributes }) => {
    const { contacts, fontSize, color, hoverColor } = attributes;

    const addContact = () => {
      const newContact = {
        label: 'Phone',
        value: '+123 456 7890',
        link: '',
        iconClass: 'fa-solid fa-phone',
      };
      setAttributes({ contacts: [...contacts, newContact] });
    };

    const updateContact = (index, key, value) => {
      const updated = [...contacts];
      updated[index][key] = value;
      setAttributes({ contacts: updated });
    };

    const removeContact = (index) => {
      const updated = contacts.filter((_, i) => i !== index);
      setAttributes({ contacts: updated });
    };

    const blockProps = useBlockProps({
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        alignItems: 'center',
      },
    });

    const contactStyle = {
      fontSize: `${fontSize}px`,
      color,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      textDecoration: 'none',
      transition: 'color 0.3s ease',
    };

    return (
      <div {...blockProps}>
        <InspectorControls>
          <PanelBody title="Style Settings" initialOpen={true}>
            <RangeControl
              label="Font Size"
              value={fontSize}
              onChange={(val) => setAttributes({ fontSize: val })}
              min={10}
              max={40}
              step={1}
            />
            <p><strong>Text & Icon Color</strong></p>
            <ColorPalette
              value={color}
              onChange={(val) => setAttributes({ color: val })}
            />
            <p><strong>Hover Color</strong></p>
            <ColorPalette
              value={hoverColor}
              onChange={(val) => setAttributes({ hoverColor: val })}
            />
          </PanelBody>

          <PanelBody title="Contact Items" initialOpen={true}>
            <Button
              isPrimary
              onClick={addContact}
              style={{ marginBottom: '10px' }}
            >
              + Add Contact Item
            </Button>

            {contacts.map((contact, index) => (
              <div
                key={index}
                style={{
                  borderBottom: '1px solid #ddd',
                  marginBottom: '15px',
                  paddingBottom: '10px',
                }}
              >
                <TextControl
                  label="Label"
                  value={contact.label}
                  onChange={(val) => updateContact(index, 'label', val)}
                  help="Example: Call Us, Email, WhatsApp"
                />
                <TextControl
                  label="Value (Phone or Email)"
                  value={contact.value}
                  onChange={(val) => updateContact(index, 'value', val)}
                  help="Example: +123 456 7890 or info@domain.com"
                />
                <TextControl
                  label="Link (tel:, mailto:, or URL)"
                  value={contact.link}
                  onChange={(val) => updateContact(index, 'link', val)}
                  help="Example: tel:+1234567890 or mailto:info@domain.com"
                />
                <TextControl
                  label="Font Awesome Icon Class"
                  value={contact.iconClass}
                  onChange={(val) => updateContact(index, 'iconClass', val)}
                  help="Example: fa-solid fa-phone or fa-regular fa-envelope"
                />
                <Button
                  isDestructive
                  onClick={() => removeContact(index)}
                  style={{ marginTop: '10px' }}
                >
                  Remove Contact
                </Button>
              </div>
            ))}
          </PanelBody>
        </InspectorControls>

        {/* Editor Preview */}
        <div className="themidev-contact-info-preview">
          {contacts.map((contact, i) => (
            <a
              key={i}
              href={contact.link || '#'}
              style={contactStyle}
              onMouseEnter={(e) => (e.target.style.color = hoverColor)}
              onMouseLeave={(e) => (e.target.style.color = color)}
            >
              <i className={contact.iconClass}></i>
              <span>{contact.value}</span>
            </a>
          ))}
          {contacts.length === 0 && (
            <p style={{ color: '#999' }}>No contact info added yet.</p>
          )}
        </div>
      </div>
    );
  },

  save: ({ attributes }) => {
    const { contacts, fontSize, color, hoverColor } = attributes;
    const blockProps = useBlockProps.save();

    return (
      <div {...blockProps} className="themidev-contact-info">
        <style>
          {`
            .wab-contact-info a {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              font-size: ${fontSize}px;
              color: ${color};
              text-decoration: none;
              transition: color 0.3s ease;
              margin-right: 15px;
            }
            .wab-contact-info a:hover {
              color: ${hoverColor};
            }
          `}
        </style>

        {contacts.map((contact, i) => (
          <a
            key={i}
            href={contact.link || '#'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className={contact.iconClass}></i>
            <span>{contact.value}</span>
          </a>
        ))}
      </div>
    );
  },
});
