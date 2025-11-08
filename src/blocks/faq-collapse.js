import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps,
    InspectorControls
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    TextControl
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/* -----------------------------
   FAQ Collapse Block (Web Advisor)
----------------------------- */

registerBlockType('web-advisor/faq-collapse', {
    title: 'FAQ Collapse (Web Advisor)',
    icon: 'editor-help',
    category: 'widgets',
    attributes: {
        faqs: {
            type: 'array',
            default: [],
        },
    },

    edit: ({ attributes, setAttributes }) => {
        const { faqs } = attributes;

        const addFAQ = () => {
            const newFAQs = [...faqs, { question: '', answer: '' }];
            setAttributes({ faqs: newFAQs });
        };

        const updateFAQ = (index, field, value) => {
            const newFAQs = [...faqs];
            newFAQs[index][field] = value;
            setAttributes({ faqs: newFAQs });
        };

        const removeFAQ = (index) => {
            const newFAQs = [...faqs];
            newFAQs.splice(index, 1);
            setAttributes({ faqs: newFAQs });
        };

        const blockProps = useBlockProps({
            className: 'web-advisor-faq-collapse',
            style: {
                border: '1px dashed #ccc',
                padding: '15px',
                borderRadius: '8px',
            },
        });

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title="FAQ Settings" initialOpen={true}>
                        <p>Add or edit FAQs below.</p>
                        <Button isPrimary onClick={addFAQ}>
                            + Add New FAQ
                        </Button>
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <h3 style={{ marginBottom: '15px' }}>FAQ Collapse (Bootstrap)</h3>

                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="faq-item"
                            style={{
                                background: '#f9f9f9',
                                padding: '10px',
                                marginBottom: '10px',
                                borderRadius: '6px',
                            }}
                        >
                            <TextControl
                                label={`Question ${index + 1}`}
                                value={faq.question}
                                onChange={(value) =>
                                    updateFAQ(index, 'question', value)
                                }
                            />

                            <TextControl
                                label="Answer"
                                value={faq.answer}
                                onChange={(value) =>
                                    updateFAQ(index, 'answer', value)
                                }
                            />

                            <Button
                                isDestructive
                                style={{ marginTop: '10px' }}
                                onClick={() => removeFAQ(index)}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}

                    <Button
                        isPrimary
                        onClick={addFAQ}
                        style={{ marginTop: '10px' }}
                    >
                        + Add Another FAQ
                    </Button>
                </div>
            </Fragment>
        );
    },

    save: ({ attributes }) => {
        const { faqs } = attributes;

        const blockProps = useBlockProps.save({
            className: 'web-advisor-faq-collapse accordion',
            id: 'faqAccordion',
        });

        // Build FAQ schema JSON-LD for SEO
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        };

        return (
            <div {...blockProps}>
                {/* Accordion */}
                {faqs.map((faq, index) => (
                    <div className="accordion-item" key={index}>
                        <h2 className="accordion-header" id={`heading${index}`}>
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse${index}`}
                                aria-expanded="false"
                                aria-controls={`collapse${index}`}
                            >
                                {faq.question}
                            </button>
                        </h2>
                        <div
                            id={`collapse${index}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading${index}`}
                            data-bs-parent="#faqAccordion"
                        >
                            <div className="accordion-body">{faq.answer}</div>
                        </div>
                    </div>
                ))}

                {/* FAQ Schema for SEO */}
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </div>
        );
    },
});
