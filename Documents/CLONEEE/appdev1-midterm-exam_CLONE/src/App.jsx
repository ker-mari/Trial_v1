import './App.css'
import { useState } from 'react';

function App() {

  const [toggleModal, setToggleModal] = useState(false);

  function handleToggleModal() {
    setToggleModal(!toggleModal);
  }

  return (
    <>
      {/* <div id="js-preloader" className="js-preloader">
  <div className="preloader-inner">
    <span className="dot" />
    <div className="dots">
      <span />
      <span />
      <span />
    </div>
  </div>
</div> */}


      {/* ***** Header Area Start ***** */}
      <header
        className="header-area header-sticky wow slideInDown"
        data-wow-duration="0.75s"
        data-wow-delay="0s"
      >
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="main-nav">
                {/* ***** Logo Start ***** */}
                <a href="index.html" className="logo">
                  <img src="assets/images/logo.png" alt="Chain App Dev" />
                </a>
                {/* ***** Logo End ***** */}
                {/* ***** Menu Start ***** */}
                <ul className="nav">
                  <li className="scroll-to-section">
                    <a href="#top" className="active">
                      Home
                    </a>
                  </li>
                  <li className="scroll-to-section">
                    <a href="#services">Services</a>
                  </li>
                  <li className="scroll-to-section">
                    <a href="#about">About</a>
                  </li>
                  <li className="scroll-to-section">
                    <a href="#pricing">Pricing</a>
                  </li>
                  <li className="scroll-to-section">
                    <a href="#newsletter">Newsletter</a>
                  </li>
                  <li>
                    <div className="gradient-button">
                      <a id="modal_trigger" href="#modal" onClick={handleToggleModal}>

                        <i className="fa fa-sign-in-alt" /> Sign In Now
                      </a>
                    </div>
                  </li>
                </ul>
                <a className="menu-trigger">
                  <span>Menu</span>
                </a>
                {/* ***** Menu End ***** */}
              </nav>
            </div>
          </div>
        </div>
      </header>
      {/* ***** Header Area End ***** */}
      <div
        id="modal"
        className="popupContainer"
        style={
          toggleModal
            ? {
              display: "block",
              position: "fixed",
              opacity: 1,
              zIndex: 11000,
              left: "50%",
              marginLeft: "-165px",
              top: 100,
            }
            : {
              display: "none",
            }
        }
      >

        <div className="popupHeader">
          <span className="header_title">Login</span>
          <span className="modal_close" onClick={handleToggleModal}>
            <i className="fa fa-times" />
          </span>
        </div>
        <section className="popupBody">

          {/* Social Login */}
          <div className="social_login">
            <div className="">
              <a href="#" className="social_box fb">
                <span className="icon">
                  <i className="fab fa-facebook" />
                </span>
                <span className="icon_title">Connect with Facebook</span>
              </a>
              <a href="#" className="social_box google">
                <span className="icon">
                  <i className="fab fa-google-plus" />
                </span>
                <span className="icon_title">Connect with Google</span>
              </a>
            </div>
            <div className="centeredText">
              <span>Or use your Email address</span>
            </div>
            <div className="action_btns">
              <div className="one_half">
                <a href="#" id="login_form" className="btn">
                  Login
                </a>
              </div>
              <div className="one_half last">
                <a href="#" id="register_form" className="btn">
                  Sign up
                </a>
              </div>
            </div>
          </div>
          {/* Username & Password Login form */}
          <div className="user_login">
            <form>
              <label>Email / Username</label>
              <input type="text" />
              <br />
              <label>Password</label>
              <input type="password" />
              <br />
              <div className="checkbox">
                <input id="remember" type="checkbox" />
                <label htmlFor="remember">Remember me on this computer</label>
              </div>
              <div className="action_btns">
                <div className="one_half">
                  <a href="#" className="btn back_btn">
                    <i className="fa fa-angle-double-left" /> Back
                  </a>
                </div>
                <div className="one_half last">
                  <a href="#" className="btn btn_red">
                    Login
                  </a>
                </div>
              </div>
            </form>
            <a href="#" className="forgot_password">
              Forgot password?
            </a>
          </div>
          {/* Register Form */}
          <div className="user_register">
            <form>
              <label>Full Name</label>
              <input type="text" />
              <br />
              <label>Email Address</label>
              <input type="email" />
              <br />
              <label>Password</label>
              <input type="password" />
              <br />
              <div className="checkbox">
                <input id="send_updates" type="checkbox" />
                <label htmlFor="send_updates">
                  Send me occasional email updates
                </label>
              </div>
              <div className="action_btns">
                <div className="one_half">
                  <a href="#" className="btn back_btn">
                    <i className="fa fa-angle-double-left" /> Back
                  </a>
                </div>
                <div className="one_half last">
                  <a href="#" className="btn btn_red">
                    Register
                  </a>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
      <div
        className="main-banner wow fadeIn"
        id="top"
        data-wow-duration="1s"
        data-wow-delay="0.5s"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-6 align-self-center">
                  <div
                    className="left-content show-up header-text wow fadeInLeft"
                    data-wow-duration="1s"
                    data-wow-delay="1s"
                  >
                    <div className="row">
                      <div className="col-lg-12">
                        <h2>Get The Latest App From App Stores</h2>
                        <p>
                          Chain App Dev is an app landing page HTML5 template based
                          on Bootstrap v5.1.3 CSS layout provided by TemplateMo, a
                          great website to download free CSS templates.
                        </p>
                      </div>
                      <div className="col-lg-12">
                        <div className="white-button first-button scroll-to-section">
                          <a href="#contact">
                            Free Quote <i className="fab fa-apple" />
                          </a>
                        </div>
                        <div className="white-button scroll-to-section">
                          <a href="#contact">
                            Free Quote <i className="fab fa-google-play" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div
                    className="right-image wow fadeInRight"
                    data-wow-duration="1s"
                    data-wow-delay="0.5s"
                  >
                    <img src="assets/images/slider-dec.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="services" className="services section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div
                className="section-heading  wow fadeInDown"
                data-wow-duration="1s"
                data-wow-delay="0.5s"
              >
                <h4>
                  Amazing <em>Services &amp; Features</em> for you
                </h4>
                <img src="assets/images/heading-line-dec.png" alt="" />
                <p>
                  If you need the greatest collection of HTML templates for your
                  business, please visit{" "}
                  <a rel="nofollow" href="https://www.toocss.com/" target="_blank">
                    TooCSS
                  </a>{" "}
                  Blog. If you need to have a contact form PHP script, go to{" "}
                  <a href="https://templatemo.com/contact" target="_parent">
                    our contact page
                  </a>{" "}
                  for more information.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="service-item first-service">
                <div className="icon" />
                <h4>App Maintenance</h4>
                <p>
                  You are not allowed to redistribute this template ZIP file on any
                  other website.
                </p>
                <div className="text-button">
                  <a href="#">
                    Read More <i className="fa fa-arrow-right" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="service-item second-service">
                <div className="icon" />
                <h4>Rocket Speed of App</h4>
                <p>
                  You are allowed to use the Chain App Dev HTML template. Feel free
                  to modify or edit this layout.
                </p>
                <div className="text-button">
                  <a href="#">
                    Read More <i className="fa fa-arrow-right" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="service-item third-service">
                <div className="icon" />
                <h4>Multi Workflow Idea</h4>
                <p>
                  If this template is beneficial for your work, please support us{" "}
                  <a
                    rel="nofollow"
                    href="https://paypal.me/templatemo"
                    target="_blank"
                  >
                    a little via PayPal
                  </a>
                  . Thank you.
                </p>
                <div className="text-button">
                  <a href="#">
                    Read More <i className="fa fa-arrow-right" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="service-item fourth-service">
                <div className="icon" />
                <h4>24/7 Help &amp; Support</h4>
                <p>
                  Lorem ipsum dolor consectetur adipiscing elit sedder williamsburg
                  photo booth quinoa and fashion axe.
                </p>
                <div className="text-button">
                  <a href="#">
                    Read More <i className="fa fa-arrow-right" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="about" className="about-us section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 align-self-center">
              <div className="section-heading">
                <h4>
                  About <em>What We Do</em> &amp; Who We Are
                </h4>
                <img src="assets/images/heading-line-dec.png" alt="" />
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eismod tempor incididunt ut labore et dolore magna.
                </p>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="box-item">
                    <h4>
                      <a href="#">Maintance Problems</a>
                    </h4>
                    <p>Lorem Ipsum Text</p>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="box-item">
                    <h4>
                      <a href="#">24/7 Support &amp; Help</a>
                    </h4>
                    <p>Lorem Ipsum Text</p>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="box-item">
                    <h4>
                      <a href="#">Fixing Issues About</a>
                    </h4>
                    <p>Lorem Ipsum Text</p>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="box-item">
                    <h4>
                      <a href="#">Co. Development</a>
                    </h4>
                    <p>Lorem Ipsum Text</p>
                  </div>
                </div>
                <div className="col-lg-12">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eismod tempor idunte ut labore et dolore adipiscing magna.
                  </p>
                  <div className="gradient-button">
                    <a href="#">Start 14-Day Free Trial</a>
                  </div>
                  <span>*No Credit Card Required</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="right-image">
                <img src="assets/images/about-right-dec.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="clients" className="the-clients">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className="section-heading">
                <h4>
                  Check What <em>The Clients Say</em> About Our App Dev
                </h4>
                <img src="assets/images/heading-line-dec.png" alt="" />
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eismod tempor incididunt ut labore et dolore magna.
                </p>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="naccs">
                <div className="grid">
                  <div className="row">
                    <div className="col-lg-7 align-self-center">
                      <div className="menu">
                        <div className="first-thumb active">
                          <div className="thumb">
                            <div className="row">
                              <div className="col-lg-4 col-sm-4 col-12">
                                <h4>David Martino Co</h4>
                                <span className="date">30 November 2021</span>
                              </div>
                              <div className="col-lg-4 col-sm-4 d-none d-sm-block">
                                <span className="category">Financial Apps</span>
                              </div>
                              <div className="col-lg-4 col-sm-4 col-12">
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <span className="rating">4.8</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="thumb">
                            <div className="row">
                              <div className="col-lg-4 col-sm-4 col-12">
                                <h4>Jake Harris Nyo</h4>
                                <span className="date">29 November 2021</span>
                              </div>
                              <div className="col-lg-4 col-sm-4 d-none d-sm-block">
                                <span className="category">Digital Business</span>
                              </div>
                              <div className="col-lg-4 col-sm-4 col-12">
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <span className="rating">4.5</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="thumb">
                            <div className="row">
                              <div className="col-lg-4 col-sm-4 col-12">
                                <h4>May Catherina</h4>
                                <span className="date">27 November 2021</span>
                              </div>
                              <div className="col-lg-4 col-sm-4 d-none d-sm-block">
                                <span className="category">
                                  Business &amp; Economics
                                </span>
                              </div>
                              <div className="col-lg-4 col-sm-4 col-12">
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <span className="rating">4.7</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="thumb">
                            <div className="row">
                              <div className="col-lg-4 col-sm-4 col-12">
                                <h4>Random User</h4>
                                <span className="date">24 November 2021</span>
                              </div>
                              <div className="col-lg-4 col-sm-4 d-none d-sm-block">
                                <span className="category">New App Ecosystem</span>
                              </div>
                              <div className="col-lg-4 col-sm-4 col-12">
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <span className="rating">3.9</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="last-thumb">
                          <div className="thumb">
                            <div className="row">
                              <div className="col-lg-4 col-sm-4 col-12">
                                <h4>Mark Amber Do</h4>
                                <span className="date">21 November 2021</span>
                              </div>
                              <div className="col-lg-4 col-sm-4 d-none d-sm-block">
                                <span className="category">Web Development</span>
                              </div>
                              <div className="col-lg-4 col-sm-4 col-12">
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <span className="rating">4.3</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-5">
                      <ul className="nacc">
                        <li className="active">
                          <div>
                            <div className="thumb">
                              <div className="row">
                                <div className="col-lg-12">
                                  <div className="client-content">
                                    <img src="assets/images/quote.png" alt="" />
                                    <p>
                                      “Lorem ipsum dolor sit amet, consectetur
                                      adpiscing elit, sed do eismod tempor idunte ut
                                      labore et dolore magna aliqua darwin kengan
                                      lorem ipsum dolor sit amet, consectetur picing
                                      elit massive big blasta.”
                                    </p>
                                  </div>
                                  <div className="down-content">
                                    <img
                                      src="assets/images/client-image.jpg"
                                      alt=""
                                    />
                                    <div className="right-content">
                                      <h4>David Martino</h4>
                                      <span>CEO of David Company</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div>
                            <div className="thumb">
                              <div className="row">
                                <div className="col-lg-12">
                                  <div className="client-content">
                                    <img src="assets/images/quote.png" alt="" />
                                    <p>
                                      “CTO, Lorem ipsum dolor sit amet, consectetur
                                      adpiscing elit, sed do eismod tempor idunte ut
                                      labore et dolore magna aliqua darwin kengan
                                      lorem ipsum dolor sit amet, consectetur picing
                                      elit massive big blasta.”
                                    </p>
                                  </div>
                                  <div className="down-content">
                                    <img
                                      src="assets/images/client-image.jpg"
                                      alt=""
                                    />
                                    <div className="right-content">
                                      <h4>Jake H. Nyo</h4>
                                      <span>CTO of Digital Company</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div>
                            <div className="thumb">
                              <div className="row">
                                <div className="col-lg-12">
                                  <div className="client-content">
                                    <img src="assets/images/quote.png" alt="" />
                                    <p>
                                      “May, Lorem ipsum dolor sit amet, consectetur
                                      adpiscing elit, sed do eismod tempor idunte ut
                                      labore et dolore magna aliqua darwin kengan
                                      lorem ipsum dolor sit amet, consectetur picing
                                      elit massive big blasta.”
                                    </p>
                                  </div>
                                  <div className="down-content">
                                    <img
                                      src="assets/images/client-image.jpg"
                                      alt=""
                                    />
                                    <div className="right-content">
                                      <h4>May C.</h4>
                                      <span>Founder of Catherina Co.</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div>
                            <div className="thumb">
                              <div className="row">
                                <div className="col-lg-12">
                                  <div className="client-content">
                                    <img src="assets/images/quote.png" alt="" />
                                    <p>
                                      “Lorem ipsum dolor sit amet, consectetur
                                      adpiscing elit, sed do eismod tempor idunte ut
                                      labore et dolore magna aliqua darwin kengan
                                      lorem ipsum dolor sit amet, consectetur picing
                                      elit massive big blasta.”
                                    </p>
                                  </div>
                                  <div className="down-content">
                                    <img
                                      src="assets/images/client-image.jpg"
                                      alt=""
                                    />
                                    <div className="right-content">
                                      <h4>Random Staff</h4>
                                      <span>Manager, Digital Company</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div>
                            <div className="thumb">
                              <div className="row">
                                <div className="col-lg-12">
                                  <div className="client-content">
                                    <img src="assets/images/quote.png" alt="" />
                                    <p>
                                      “Mark, Lorem ipsum dolor sit amet, consectetur
                                      adpiscing elit, sed do eismod tempor idunte ut
                                      labore et dolore magna aliqua darwin kengan
                                      lorem ipsum dolor sit amet, consectetur picing
                                      elit massive big blasta.”
                                    </p>
                                  </div>
                                  <div className="down-content">
                                    <img
                                      src="assets/images/client-image.jpg"
                                      alt=""
                                    />
                                    <div className="right-content">
                                      <h4>Mark Am</h4>
                                      <span>CTO, Amber Do Company</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="pricing" className="pricing-tables">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className="section-heading">
                <h4>
                  We Have The Best Pre-Order <em>Prices</em> You Can Get
                </h4>
                <img src="assets/images/heading-line-dec.png" alt="" />
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eismod tempor incididunt ut labore et dolore magna.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="pricing-item-regular">
                <span className="price">$12</span>
                <h4>Standard Plan App</h4>
                <div className="icon">
                  <img src="assets/images/pricing-table-01.png" alt="" />
                </div>
                <ul>
                  <li>Lorem Ipsum Dolores</li>
                  <li>20 TB of Storage</li>
                  <li className="non-function">Life-time Support</li>
                  <li className="non-function">Premium Add-Ons</li>
                  <li className="non-function">Fastest Network</li>
                  <li className="non-function">More Options</li>
                </ul>
                <div className="border-button">
                  <a href="#">Purchase This Plan Now</a>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="pricing-item-pro">
                <span className="price">$25</span>
                <h4>Business Plan App</h4>
                <div className="icon">
                  <img src="assets/images/pricing-table-01.png" alt="" />
                </div>
                <ul>
                  <li>Lorem Ipsum Dolores</li>
                  <li>50 TB of Storage</li>
                  <li>Life-time Support</li>
                  <li>Premium Add-Ons</li>
                  <li className="non-function">Fastest Network</li>
                  <li className="non-function">More Options</li>
                </ul>
                <div className="border-button">
                  <a href="#">Purchase This Plan Now</a>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="pricing-item-regular">
                <span className="price">$66</span>
                <h4>Premium Plan App</h4>
                <div className="icon">
                  <img src="assets/images/pricing-table-01.png" alt="" />
                </div>
                <ul>
                  <li>Lorem Ipsum Dolores</li>
                  <li>120 TB of Storage</li>
                  <li>Life-time Support</li>
                  <li>Premium Add-Ons</li>
                  <li>Fastest Network</li>
                  <li>More Options</li>
                </ul>
                <div className="border-button">
                  <a href="#">Purchase This Plan Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer id="newsletter">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className="section-heading">
                <h4>
                  Join our mailing list to receive the news &amp; latest trends
                </h4>
              </div>
            </div>
            <div className="col-lg-6 offset-lg-3">
              <form id="search" action="#" method="GET">
                <div className="row">
                  <div className="col-lg-6 col-sm-6">
                    <fieldset>
                      <input
                        type="address"
                        name="address"
                        className="email"
                        placeholder="Email Address..."
                        autoComplete="on"
                        required=""
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-6 col-sm-6">
                    <fieldset>
                      <button type="submit" className="main-button">
                        Subscribe Now <i className="fa fa-angle-right" />
                      </button>
                    </fieldset>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3">
              <div className="footer-widget">
                <h4>Contact Us</h4>
                <p>Rio de Janeiro - RJ, 22795-008, Brazil</p>
                <p>
                  <a href="#">010-020-0340</a>
                </p>
                <p>
                  <a href="#">info@company.co</a>
                </p>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="footer-widget">
                <h4>About Us</h4>
                <ul>
                  <li>
                    <a href="#">Home</a>
                  </li>
                  <li>
                    <a href="#">Services</a>
                  </li>
                  <li>
                    <a href="#">About</a>
                  </li>
                  <li>
                    <a href="#">Testimonials</a>
                  </li>
                  <li>
                    <a href="#">Pricing</a>
                  </li>
                </ul>
                <ul>
                  <li>
                    <a href="#">About</a>
                  </li>
                  <li>
                    <a href="#">Testimonials</a>
                  </li>
                  <li>
                    <a href="#">Pricing</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="footer-widget">
                <h4>Useful Links</h4>
                <ul>
                  <li>
                    <a href="#">Free Apps</a>
                  </li>
                  <li>
                    <a href="#">App Engine</a>
                  </li>
                  <li>
                    <a href="#">Programming</a>
                  </li>
                  <li>
                    <a href="#">Development</a>
                  </li>
                  <li>
                    <a href="#">App News</a>
                  </li>
                </ul>
                <ul>
                  <li>
                    <a href="#">App Dev Team</a>
                  </li>
                  <li>
                    <a href="#">Digital Web</a>
                  </li>
                  <li>
                    <a href="#">Normal Apps</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="footer-widget">
                <h4>About Our Company</h4>
                <div className="logo">
                  <img src="assets/images/white-logo.png" alt="" />
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore.
                </p>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="copyright-text">
                <p>
                  Copyright © 2022 Chain App Dev Company. All Rights Reserved.
                  <br />
                  Design:{" "}
                  <a
                    href="https://templatemo.com/"
                    target="_blank"
                    title="css templates"
                  >
                    TemplateMo
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div
        id="lean_overlay"
        style={
          toggleModal
            ? { display: "block", opacity: "0.6" }
            : { display: "none" }
        }
      />
    </>

  )
}

export default App;
