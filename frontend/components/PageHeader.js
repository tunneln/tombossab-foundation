import React from 'react';
import Link from 'next/link';

const PageHeader = (props) => {
    return (
        <section className="breadcrumb-area" style={{'backgroundImage': `url(${props.imgUrl})`}}>
            <div className="container" >
                <div className="row">
                    <div className="col-lg-12">
                        <div className="breadcrumb-content">
                            <h2 className="breadcrumb__title">{ props.title }</h2>
                            <ul className="breadcrumb__list">
                                {props.prev ? 
                                <li className="active__list-item" style={{ whiteSpace: 'pre' }}><Link href="/">home</Link> &nbsp;|&nbsp; <Link href={ props.link }>{ props.prev }</Link> &nbsp;|&nbsp; { props.title }</li> :
                                <li className="active__list-item" style={{ whiteSpace: 'pre' }}><Link href="/">home</Link> &nbsp;|&nbsp; { props.title }</li>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PageHeader;
