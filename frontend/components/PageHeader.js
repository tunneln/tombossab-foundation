import React from 'react';
import Link from 'next/link';

// Separator between crumbs. The `whiteSpace: 'pre'` on the <li> preserves
// these spaces and keeps the trail on one line.
const SEPARATOR = ' > ';

// Page banner + breadcrumb trail. "home" and the current page (`title`) are
// always added automatically; pass whatever sits in between:
//
//   <PageHeader title="About Us" />                                  → home > About Us
//   <PageHeader title="Coffee" prev="Events" link="/events" />       → home > Events > Coffee
//   <PageHeader title="Field Day" crumbs={[{ label: 'Events', href: '/events' }]} />
//
// `crumbs` is the modular form (any depth); `prev`/`link` is kept as a
// shorthand for the common single-parent case.
const PageHeader = ({ title, prev, link, crumbs, imgUrl }) => {
    const trail = [
        { label: 'home', href: '/' },
        ...(crumbs ?? (prev ? [{ label: prev, href: link }] : [])),
        { label: title }, // current page — rendered as plain text, no link
    ];

    return (
        <section className="breadcrumb-area" style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : undefined}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="breadcrumb-content">
                            <h2 className="breadcrumb__title">{ title }</h2>
                            <ul className="breadcrumb__list">
                                <li className="active__list-item" style={{ whiteSpace: 'pre' }}>
                                    {trail.map((crumb, i) => (
                                        <React.Fragment key={i}>
                                            {i > 0 && SEPARATOR}
                                            {crumb.href ? <Link href={crumb.href}>{ crumb.label }</Link> : crumb.label}
                                        </React.Fragment>
                                    ))}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PageHeader;
