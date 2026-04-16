import StaticPageLayout from './StaticPageLayout';

const About = () => {
    return (
        <StaticPageLayout title="About Us" subtitle="Redefining Modern E-Commerce">
            <p>
                Founded in 2024, LuxeStore began with a simple mission: to make premium quality products accessible to everyone, everywhere.
                What started as a small curated collection has grown into a global destination for those who appreciate style, innovation, and quality.
            </p>

            <h2>Our Mission</h2>
            <p>
                We believe that shopping should be an experience, not just a transaction. Our team works tirelessly to curate products that
                combine exceptional design with everyday functionality. We are committed to sustainability, ethical sourcing, and
                providing an unparalleled customer service experience.
            </p>

            <h2>Why Choose Us?</h2>
            <ul>
                <li><strong>Quality First:</strong> We never compromise on the quality of our products.</li>
                <li><strong>Customer Centric:</strong> Your satisfaction is our top priority.</li>
                <li><strong>Global Delivery:</strong> We ship to over 100 countries worldwide.</li>
                <li><strong>Secure Shopping:</strong> Your data is protected by industry-leading security.</li>
            </ul>

            <h2>Join Our Journey</h2>
            <p>
                As we continue to grow, our promise remains the same: to provide you with the best products and the best service.
                Thank you for being part of our story.
            </p>
        </StaticPageLayout>
    );
};

export default About;
