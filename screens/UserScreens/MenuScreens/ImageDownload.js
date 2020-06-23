import * as React from 'react';
import { ActivityIndicator, Alert} from 'react-native';
import ImageView from "react-native-image-viewing";


export default function ImageDownload(props) {
    const parameters = props.route.params;
    const [imageUri, setImageUri] = React.useState(null);
    const [visible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
        setImageUri(props.route.params.imageuri);
        return () => {
            setImageUri(null);
            setIsVisible(false);
        }
    }, [props.route.params.imageuri])
    

    return (
        <React.Fragment>
            {(imageUri)? (
                <ImageView
                    images={[{ uri: imageUri }]}
                    visible={visible}
                    onRequestClose={() => {
                        setIsVisible(false);
                        props.navigation.goBack();
                    }}
                />
            ) : (<ActivityIndicator size="large"/>)}
        </React.Fragment>
    )
}