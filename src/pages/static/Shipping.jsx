import StaticPageLayout from './StaticPageLayout';

const Shipping = () => {
    return (
        <StaticPageLayout title="Shipping Information" subtitle="Fast, reliable delivery aimed at your convenience">
            <h2>Shipping Methods</h2>
            <p>We offer three main shipping methods for domestic orders:</p>
            <ul>
                <li><strong>Standard Ground:</strong> 3-5 business days. Free on orders over $50.</li>
                <li><strong>Expedited:</strong> 2 business days. $15 flat rate.</li>
                <li><strong>Overnight:</strong> Next business day delivery. $35 flat rate.</li>
            </ul>

            <h2>International Shipping</h2>
            <p>
                We ship to most countries worldwide via DHL Express. International shipping typically takes 5-10 business days.
                Please note that duties and taxes are calculated at checkout and are the responsibility of the customer.
            </p>

            <h2>Order Processing</h2>
            <p>
                Orders placed before 2 PM EST are processed the same business day. Orders placed after 2 PM EST will be processed the following business day.
                You will receive a confirmation email with tracking information as soon as your order ships.
            </p>
        </StaticPageLayout>
    );
};

export default Shipping;
