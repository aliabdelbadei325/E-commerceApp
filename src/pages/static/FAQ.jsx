import StaticPageLayout from './StaticPageLayout';
import { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="glass-card" style={{ marginBottom: '15px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{question}</h3>
                {isOpen ? <FiMinus /> : <FiPlus />}
            </div>
            {isOpen && (
                <div style={{ padding: '0 20px 20px', color: 'var(--color-text-secondary)', borderTop: '1px solid var(--color-border)', paddingTop: '15px' }}>
                    {answer}
                </div>
            )}
        </div>
    );
};

const FAQ = () => {
    const faqs = [
        { q: "How long does shipping take?", a: "Standard shipping typically takes 3-5 business days within the US. International shipping can take 7–14 business days depending on the destination." },
        { q: "What is your return policy?", a: "We accept returns within 30 days of purchase for a full refund. Items must be unused and in original packaging." },
        { q: "Do you offer international shipping?", a: "Yes, we ship to over 100 countries worldwide. Shipping costs are calculated at checkout." },
        { q: "How can I track my order?", a: "Once your order ships, you will receive an email with a tracking number and a link to track your package." },
        { q: "Are your products authentic?", a: "Absolutely. We source directly from manufacturers and authorized distributors to ensure 100% authenticity." }
    ];

    return (
        <StaticPageLayout title="Frequently Asked Questions" subtitle="Find answers to common questions">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.q} answer={faq.a} />
                ))}
            </div>
        </StaticPageLayout>
    );
};

export default FAQ;
