const About = () => {
  return (
    <div>
      <section className="bg-primary text-white py-5">
        <div className="container text-center">
          <h1 className="display-3 fw-bold mb-4">About NELLY</h1>
          <p className="lead mb-0">Redefining Nigerian Fashion with Style, Quality, and Heritage</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <h2 className="fw-bold mb-4">Our Story</h2>
              <p className="lead">
                Founded in 2019 in the heart of Lagos, NELLY started as a small boutique with a big vision - 
                to bring contemporary Nigerian fashion to the forefront while celebrating our rich cultural heritage.
              </p>
              <p>
                What began with just 50 unique pieces has now grown into a nationwide fashion movement, 
                serving over 50,000 satisfied customers across all 36 states and the FCT.
              </p>
            </div>
            <div className="col-md-6">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
                alt="NELLY Store"
                className="img-fluid rounded shadow"
              />
            </div>
          </div>

          <div className="row text-center mb-5">
            <div className="col-md-3">
              <div className="p-4">
                <h3 className="fw-bold text-primary">5+</h3>
                <p className="text-muted">Years of Excellence</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4">
                <h3 className="fw-bold text-primary">50K+</h3>
                <p className="text-muted">Happy Customers</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4">
                <h3 className="fw-bold text-primary">1000+</h3>
                <p className="text-muted">Unique Designs</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4">
                <h3 className="fw-bold text-primary">24/7</h3>
                <p className="text-muted">Customer Support</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3 text-center mb-4">
              <i className="bi bi-shield-check fs-1 text-primary mb-3 d-block"></i>
              <h5 className="fw-bold">Quality First</h5>
              <p className="text-muted">
                Every piece is carefully crafted with premium materials and attention to detail.
              </p>
            </div>
            <div className="col-md-3 text-center mb-4">
              <i className="bi bi-heart fs-1 text-primary mb-3 d-block"></i>
              <h5 className="fw-bold">Nigerian Heritage</h5>
              <p className="text-muted">
                We celebrate our rich cultural heritage through modern designs.
              </p>
            </div>
            <div className="col-md-3 text-center mb-4">
              <i className="bi bi-currency-dollar fs-1 text-primary mb-3 d-block"></i>
              <h5 className="fw-bold">Affordable Luxury</h5>
              <p className="text-muted">
                Premium fashion at competitive prices without compromising quality.
              </p>
            </div>
            <div className="col-md-3 text-center mb-4">
              <i className="bi bi-people fs-1 text-primary mb-3 d-block"></i>
              <h5 className="fw-bold">Customer Focus</h5>
              <p className="text-muted">
                Your satisfaction is our priority with easy returns and responsive support.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
