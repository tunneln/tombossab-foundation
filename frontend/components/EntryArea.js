import React, {Component} from 'react';
import ModalVideo from 'react-modal-video';

class EntryArea extends Component {
    constructor(){
        super()
        this.state = {
            isOpen: false
        }
    }

    handleModal = () => {
        this.setState({isOpen: !this.state.isOpen})
    }
    render() {
        return (
            <section className="entry-area">
                <div className="container">
                    <div className="row entry-static-wrap">
                        <div className="col-lg-4" style={{'paddingLeft': '45px'}}>
                            <div className="entry-static-box entry-static-box1">
                                <div className="section-icon">
                                    <img src="/images/section-icon.png" alt="section-icon" />
                                </div>
                                <h4 className="entry__title">Together we will create a stronger and more connected community</h4>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="entry-static-box entry-static-box2 d-flex align-items-center">
                                <div className="row">
                                    <div className="col-lg-4">
                                        <div className="entry-video-img">
                                            <img src="/images/entry-video-img.png" alt="entry-video-img.jpg" />
                                            <ModalVideo channel='youtube' isOpen={this.state.isOpen} videoId='pOK_yA0WG98' onClose={this.handleModal} />
                                                <div onClick={this.handleModal} className="mfp-iframe video-play-btn"
                                                   title="Play Video"><i className="fa fa-play"></i>
                                                </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-8">
                                        <div className="entry-video-text">
                                            <h4 className="entry__title">Continuing Tombossa's legacy one child at a time</h4>
                                            <p className="entry__text">Watch as we officially announce the inauguration of the Tombossa B Foundation</p>
                                            {/* Watch us as we speak about our mission */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default EntryArea;