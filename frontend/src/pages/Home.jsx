import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  BarChart2, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  Search, 
  Shield, 
  Smartphone, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section style={{ 
          padding: '6rem 2rem', 
          textAlign: 'center',
          background: 'linear-gradient(to bottom, var(--color-primary-light), var(--color-background))'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-primary)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-primary)',
              fontWeight: '500',
              fontSize: '0.875rem',
              marginBottom: '2rem',
              animation: 'slideUp 0.5s ease-out'
            }}>
              <span role="img" aria-label="sparkles">✨</span> New: AI-powered application insights
            </div>
            
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
              fontWeight: '800', 
              marginBottom: '1.5rem',
              lineHeight: '1.1'
            }}>
              Track Every Application, <br />
              <span className="text-gradient">Land Your Dream Job</span>
            </h1>
            
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'var(--color-text-muted)', 
              marginBottom: '2.5rem',
              maxWidth: '600px',
              margin: '0 auto 2.5rem auto',
              lineHeight: '1.6'
            }}>
              JobTracker helps you organize, monitor, and analyze your entire job search journey in one beautiful dashboard. Say goodbye to messy spreadsheets.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                Start Tracking Free <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                Login
              </Link>
            </div>
            
            {/* Hero Stats */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '3rem', 
              marginTop: '4rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>10k+</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Active Users</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>500k+</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Applications Tracked</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>68%</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Higher Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section style={{ padding: '0 2rem 4rem 2rem' }}>
          <div style={{ 
            maxWidth: '1000px', 
            margin: '-3rem auto 0 auto',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 10
          }}>
            {/* Mock Dashboard UI */}
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FF5F56' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFBD2E' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27C93F' }}></div>
            </div>
            <div style={{ padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {[
                    { label: 'Total Applied', value: '142', color: 'var(--color-primary)' },
                    { label: 'Interviews', value: '12', color: 'var(--color-warning)' },
                    { label: 'Offers', value: '3', color: 'var(--color-success)' }
                  ].map((stat, i) => (
                    <div key={i} style={{ padding: '1rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>{stat.label}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
                
                <div style={{ backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', padding: '1rem' }}>
                  <h4 style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>Recent Applications</h4>
                  {[
                    { company: 'Google', role: 'Frontend Engineer', status: 'Interview', color: 'var(--color-warning)' },
                    { company: 'Stripe', role: 'Full Stack Developer', status: 'Applied', color: 'var(--color-info)' },
                    { company: 'Netflix', role: 'UI Engineer', status: 'Rejected', color: 'var(--color-danger)' }
                  ].map((app, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: i !== 2 ? '1px solid var(--color-border)' : 'none' }}>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{app.company}</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{app.role}</div>
                      </div>
                      <div style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '1rem', backgroundColor: `${app.color}20`, color: app.color }}>
                        {app.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section style={{ padding: '4rem 2rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>
          <p style={{ color: 'var(--color-text-muted)', fontWeight: '500', marginBottom: '2rem' }}>Trusted by ambitious professionals</p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '2rem', 
            flexWrap: 'wrap',
            color: 'var(--color-text-light)',
            fontWeight: '600',
            fontSize: '1.1rem'
          }}>
            <span>Software Engineers</span>
            <span>&bull;</span>
            <span>Product Managers</span>
            <span>&bull;</span>
            <span>Data Scientists</span>
            <span>&bull;</span>
            <span>Designers</span>
            <span>&bull;</span>
            <span>Consultants</span>
            <span>&bull;</span>
            <span>Analysts</span>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ padding: '6rem 2rem', backgroundColor: 'var(--color-background)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Everything you need to succeed</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
                Powerful features designed to give you an unfair advantage in your job search.
              </p>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem' 
            }}>
              {[
                { icon: <Briefcase color="var(--color-primary)" size={24} />, title: 'Smart Application Tracking', desc: 'Track every job application and its current status in one organized place.' },
                { icon: <BarChart2 color="var(--color-primary)" size={24} />, title: 'Advanced Analytics', desc: 'Display useful job-search statistics and visualize your progress over time.' },
                { icon: <CheckCircle color="var(--color-primary)" size={24} />, title: 'One-Click Add', desc: 'Allow users to quickly add applications with our streamlined interface.' },
                { icon: <Clock color="var(--color-primary)" size={24} />, title: 'Smart Notifications', desc: 'Show important reminders and updates for upcoming interviews and deadlines.' },
                { icon: <Smartphone color="var(--color-primary)" size={24} />, title: 'Mobile Responsive', desc: 'Application works perfectly on mobile, tablet, and desktop devices.' },
                { icon: <Shield color="var(--color-primary)" size={24} />, title: 'Privacy First', desc: 'Your job search information is securely stored and never shared with third parties.' },
              ].map((feature, i) => (
                <div key={i} className="card" style={{ padding: '2rem', border: 'none' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: 'var(--radius-md)', 
                    backgroundColor: 'var(--color-primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{feature.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section style={{ padding: '6rem 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>How it works</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
                Three simple steps to take control of your career journey.
              </p>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              gap: '2rem',
              flexWrap: 'wrap'
            }}>
              {[
                { step: '1', title: 'Create Your Account', desc: 'Sign up in seconds and set your career goals.' },
                { step: '2', title: 'Add Applications', desc: 'Record jobs you applied for with all relevant details.' },
                { step: '3', title: 'Track & Analyze', desc: 'Monitor applications and use analytics to improve your success rate.' }
              ].map((item, i) => (
                <div key={i} style={{ flex: '1', minWidth: '250px', textAlign: 'center' }}>
                  <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    margin: '0 auto 1.5rem auto'
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ padding: '6rem 2rem', backgroundColor: 'var(--color-background)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Loved by job seekers</h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem' 
            }}>
              {[
                { quote: "JobTracker completely transformed my job search. I went from losing track of interviews to having 3 solid offers in a month.", name: "Sarah J.", role: "Frontend Developer" },
                { quote: "The analytics feature helped me realize my resume wasn't working. After tweaking it, my interview rate doubled.", name: "Michael T.", role: "Product Manager" },
                { quote: "Beautiful UI and exactly what I needed. I love the simple kanban-style visualization of my applications.", name: "Emily R.", role: "UX Designer" }
              ].map((testimonial, i) => (
                <div key={i} className="card" style={{ padding: '2rem', border: 'none' }}>
                  <div style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
                    ★★★★★
                  </div>
                  <p style={{ fontSize: '1rem', fontStyle: 'italic', marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <div style={{ fontWeight: '600' }}>{testimonial.name}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ 
          padding: '6rem 2rem', 
          textAlign: 'center',
          background: 'linear-gradient(to top, var(--color-primary-light), var(--color-background))'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready to land your dream job?</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', marginBottom: '2.5rem' }}>
              Join thousands of professionals who are taking control of their career path.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                Start Tracking Free
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                Login
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: 'var(--color-surface)', 
        borderTop: '1px solid var(--color-border)',
        padding: '4rem 2rem 2rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '3rem',
            marginBottom: '4rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Briefcase color="var(--color-primary)" size={24} />
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>
                  JobTracker
                </span>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                Organize, monitor, and analyze your job applications to land your dream job faster.
              </p>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '1.25rem', fontWeight: '600' }}>Product</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><Link to="/dashboard" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Dashboard</Link></li>
                <li><Link to="/applications" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Applications</Link></li>
                <li><Link to="/analytics" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Analytics</Link></li>
                <li><Link to="/applications/add" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Add Application</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '1.25rem', fontWeight: '600' }}>Account</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><Link to="/login" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Login</Link></li>
                <li><Link to="/register" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Sign Up</Link></li>
                <li><Link to="/profile" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Profile</Link></li>
                <li><Link to="/settings" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Settings</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '1.25rem', fontWeight: '600' }}>Company</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><Link to="/about" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>About</Link></li>
                <li><Link to="/blog" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Blog</Link></li>
                <li><Link to="/careers" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Careers</Link></li>
                <li><Link to="/contact" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingTop: '2rem',
            borderTop: '1px solid var(--color-border)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              &copy; {new Date().getFullYear()} JobTracker. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
