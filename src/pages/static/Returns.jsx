import StaticPageLayout from './StaticPageLayout';

const Returns = () => {
    return (
        <StaticPageLayout title="Returns & Exchanges" subtitle="Hassle-free returns within 30 days">
            <h2>Return Policy</h2>
            <p>
                We want you to love your purchase. If you are not completely satisfied, you may return items within <strong>30 days</strong> of delivery
                for a full refund or exchange. Items must be in new, unused condition with all original tags and packaging.
            </p>

            <h2>How to Start a Return</h2>
            <ol style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                <li>Log in to your account and go to "Order History".</li>
                <li>Select the order containing the item(s) you wish to return.</li>
                <li>Click "Request Return" and follow the instructions to print your prepaid shipping label.</li>
                <li>Pack the item(s) securely and drop off the package at any authorized carrier location.</li>
            </ol>

            <h2>Refunds</h2>
            <p>
                Once we receive your return, please allow 3-5 business days for processing. Refunds will be issued to the original form of payment.
                Depending on your bank, it may take an additional 3-7 business days for the credit to appear on your statement.
            </p>

            <h2>Exclusions</h2>
            <p>
                Final sale items, personalized products, and gift cards are not eligible for return.
            </p>
        </StaticPageLayout>
    );
};

export default Returns;
