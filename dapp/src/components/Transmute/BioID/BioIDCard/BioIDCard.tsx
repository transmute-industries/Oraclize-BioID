import * as React from 'react';
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

import {
    firebaseSignatureBiometricChallenge
} from '../../../../store/bioid/actions';

export class BioIDCard extends React.Component<any, any> {
    state = {
        value: null
    };
    componentWillReceiveProps(nextProps: any) {
        // if (nextProps.transmute.selectedContract) {
        //     this.setState({
        //         value: nextProps.transmute.selectedContract
        //     });
        // }
    }
    render() {
        return (
            <Card style={{ marginTop: '32px', marginBottom: '32px' }}>
                <CardTitle>
                    BioID
                </CardTitle>
                <CardText>
                    Current status here...

                    Need to prevent URL pollution, callback url should always exclude query string.
                </CardText>
                <CardActions>
                    <RaisedButton
                        label="Enroll"
                        onTouchTap={() => {
                            this.props.dispatch(
                                firebaseSignatureBiometricChallenge({
                                    address: this.props.transmute.lightWalletAddress,
                                    task: 'enroll',
                                    bcid: 'bws/11424/1234',
                                    app_callback_url: window.location.origin + window.location.pathname
                                })
                            );
                        }}
                    />
                    <RaisedButton
                        label="Verify"
                        onTouchTap={() => {
                            this.props.dispatch(
                                firebaseSignatureBiometricChallenge({
                                    address: this.props.transmute.lightWalletAddress,
                                    task: 'verify',
                                    bcid: 'bws/11424/1234',
                                    app_callback_url: window.location.origin + window.location.pathname
                                })
                            );
                        }}
                    />
                    <RaisedButton
                        label="Identify"

                        onTouchTap={() => {
                            this.props.dispatch(
                                firebaseSignatureBiometricChallenge({
                                    address: this.props.transmute.lightWalletAddress,
                                    task: 'identify',
                                    bcid: 'bws/11424/1234',
                                    app_callback_url: window.location.origin + window.location.pathname
                                })
                            );
                        }}
                    />
                </CardActions>
            </Card>
        );
    }
}

export default connect((state: any) => ({
    transmute: state.transmute
}))(BioIDCard) as any;
