import React from 'react'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CSS from 'csstype';

interface Props {

}

const contentStyling: CSS.Properties = {
    float: 'left',
    padding: '3%'
};

const boxStyling: CSS.Properties = {
    textAlign: 'left',
    padding: '3%'
};

export const InfoBox: React.FC<Props>  = () => {
    return (
        <div>
            <Card style={boxStyling}>
                <div style={contentStyling}>
                    <p>Give your restaurant a name.</p>
                    <ul>
                        <li>Less than 60 characters.</li>
                        <li>Remember to use good capitalisation.</li>
                    </ul>
                </div>
            </Card>
        </div>
    )
}