import React from 'react';

// e.g: <div style={styles.wrapper(theme, pageMarginLeft)}>Page content</div>;

type ConditionalStyles = (
    theme: any,
    pageMarginLeft: number
) => React.CSSProperties;

type CSSProperties = {
    [key: string]:
        | React.CSSProperties
        | { [key: string]: React.CSSProperties }
        | ConditionalStyles;
};

export class StyleSheet {
    static create<Styles extends CSSProperties>(styles: Styles): Styles {
        return styles;
    }
}
