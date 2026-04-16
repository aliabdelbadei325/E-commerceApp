import StaticPageLayout from './StaticPageLayout';

const Careers = () => {
    const jobs = [
        { title: "Senior Frontend Developer", dept: "Engineering", location: "Remote" },
        { title: "Product Designer", dept: "Design", location: "New York, NY" },
        { title: "Customer Success Specialist", dept: "Support", location: "Remote" }
    ];

    return (
        <StaticPageLayout title="Careers" subtitle="Join our growing team">
            <p>
                At LuxeStore, we're building the future of e-commerce. We're looking for passionate, innovative individuals who want to make an impact.
                We offer competitive salaries, comprehensive benefits, and a culture that values creativity and collaboration.
            </p>

            <h2>Open Positions</h2>
            <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
                {jobs.map((job, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: '0 0 5px' }}>{job.title}</h3>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-tertiary)' }}>{job.dept} • {job.location}</p>
                        </div>
                        <button className="btn btn-secondary">Apply Now</button>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <p>Don't see a role that fits? We're always looking for talent.</p>
                <a href="mailto:careers@luxestore.com" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Send us your resume</a>
            </div>
        </StaticPageLayout>
    );
};

export default Careers;
