import React ,{useEffect} from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE , Marker} from 'react-native-maps';
import { COLORS, icons, SIZES, FONTS , GOOGLE_API_KEY } from '../constants';
import MapViewDirections from 'react-native-maps-directions';

export default function OrderDelivery({route, navigation}) {

    const mapView = React.useRef();

    const [restaurant, setRestaurant] = React.useState(null);
    const [streetName, setStreetName] = React.useState("");
    const [fromLocation, setFromLocation] = React.useState(null);
    const [toLocation, setToLocation] = React.useState(null);
    const [region, setRegion] = React.useState(null);
    
    const [duration, setDuration] = React.useState(0);
    const [isReady, setIsReady] = React.useState(false);
    const [angle,setAngle] = React.useState(0);


    useEffect(() => {
        let { restaurant, currentLocation } = route.params;
        let fromLoc = currentLocation.gps;
        let toLoc = restaurant.location;
        let street = currentLocation.streetName;
        
        let mapRegion = {
            latitude: (fromLoc.latitude + toLoc.latitude) / 2,
            longitude: (fromLoc.longitude + toLoc.longitude) / 2,
            latitudeDelta: Math.abs(fromLoc.latitude - toLoc.latitude) * 2,
            longitudeDelta: Math.abs(fromLoc.longitude - toLoc.longitude) * 2,
        }
        setRestaurant(restaurant)
        setStreetName(street)
        setFromLocation(fromLoc)
        setToLocation(toLoc)
        setRegion(mapRegion)


    }, [])

    function calculateAngle(coordinates) {
        let startLat = coordinates[0]["latitude"]
        let startLng = coordinates[0]["longitude"]
        let endLat = coordinates[1]["latitude"]
        let endLng = coordinates[1]["longitude"]
        let dx = endLat - startLat
        let dy = endLng - startLng
 
        return Math.atan2(dy, dx) * 180 / Math.PI
    }

    function zoomIn () {
        let newLatitudeDelta = region.latitudeDelta / 2
        let newLongitudeDelta = region.longitudeDelta / 2

        let newRegion = {
            ...region,
            latitudeDelta : newLatitudeDelta,
            longitudeDelta : newLongitudeDelta
        }
        setRegion(newRegion)
        mapView.current.animateToRegion(newRegion, 1300)
    }
    function zoomOut () {
        let newLatitudeDelta = region.latitudeDelta * 2
        let newLongitudeDelta = region.longitudeDelta * 2

        let newRegion = {
            ...region,
            latitudeDelta : newLatitudeDelta,
            longitudeDelta : newLongitudeDelta
        }
        setRegion(newRegion)
        mapView.current.animateToRegion(newRegion, 1300)
    }

    function renderMap() {
        const destinationMarker = () => (
            <Marker coordinate = {toLocation}>
                <View style = {{height : 40, width : 40, borderRadius : 20, alignItems : 'center', justifyContent : 'center', backgroundColor : COLORS.white}}>
                    <View style = {{height : 30, width : 30, borderRadius : 15, alignItems : 'center', justifyContent : 'center', backgroundColor : COLORS.primary}}>
                        <Image
                            source = {icons.pin}
                            resizeMode = "contain"
                            style = {{
                                width : 25,
                                height : 25
                            }}
                        />
                    </View>
                </View>
            </Marker>
        )

        const carIcon = () => (
            <Marker coordinate = {fromLocation} anchor = {{x : 0.5, y : 0.5}} flat = {true}
                rotation = {angle}
            >
                <Image
                    source = {icons.car}
                    resizeMode = "contain"
                    style = {{
                        width : 40,
                        height : 40
                    }}

                />  
            </Marker>
        )
                    

        return (
            <View style = {{flex : 1}}>
                <MapView 
                    ref={mapView}
                    provider = {PROVIDER_GOOGLE}
                    initialRegion = {region}
                    style = {{flex : 1}}
                >  
                    <MapViewDirections
                        origin = {fromLocation}
                        destination = {toLocation}
                        apikey = 'Your API Key'
                        strokeWidth = {3}
                        strokeColor = {COLORS.primary}
                        onReady = {result => {
                            setDuration(Math.floor(result.duration))
                            if(!isReady){
                                //to fit the map to the markers
                                mapView.current.fitToCoordinates(result.coordinates,{
                                    edgePadding : {
                                        right : (SIZES.width / 20),
                                        bottom : (SIZES.height / 4),
                                        left : (SIZES.width / 20),
                                        top : (SIZES.height / 8),
                                    }
                                })
                                //rotate the car icon
                                let nextLoc = {
                                    latitude : result.coordinates[0]["latitude"],
                                    longitude : result.coordinates[0]["longitude"]
                                }

                                if(result.coordinates.length >= 2){
                                    let angle = calculateAngle(result.coordinates)
                                    setAngle(angle)
                                }

                                setFromLocation(nextLoc)
                                setIsReady(true)
                            }
                        }}

                    />
                    {destinationMarker()}
                    {carIcon()}
                </MapView>
            </View>
        )}

    function renderDestinationHeader() {
        return (
            <View style = {{position : 'absolute', top : 50, left : 0, right : 0, height : 50, alignItems : 'center', justifyContent : 'center'}}>
                <View style = {{flexDirection : 'row', alignItems : 'center', paddingHorizontal : SIZES.padding * 2, paddingVertical : SIZES.padding, borderRadius : SIZES.radius, backgroundColor : COLORS.white}}>
                    <Image
                        source = {icons.red_pin}
                        resizeMode = "contain"
                        style = {{
                            width : 30,
                            height : 30
                        }}
                    />
                    <View style = {{flex : 1, marginLeft : SIZES.padding}}>
                        <Text style = {{...FONTS.h4}}>{streetName}</Text>
                    </View> 
                    <Text style = {{...FONTS.h4}}>{Math.ceil(duration)} mins</Text>
                </View>
            </View>
        
    )}

    function renderDeliveryInfo() {
        return(
            <View style = {{position : 'absolute', bottom : 50, left : 0, right : 0, height : 100, alignItems : 'center', justifyContent : 'center'}}>
                <View style ={{
                    width : SIZES.width * 0.9,
                    padding : SIZES.padding * 3,
                    borderRadius : SIZES.radius,
                    backgroundColor : COLORS.white
                }}>
                    <View style = {{flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                        {/* Restaurant Courier Image  */}
                        <Image
                            source = {restaurant?.courier.avatar}
                            style = {{
                                width : 50,
                                height : 50,
                                borderRadius : 25
                            }}
                        />
                        <View style = {{flex : 1, marginLeft : SIZES.padding}}>
                          {/* Restaurant Courier Name & Rating */}
                            <View style = {{flexDirection : 'row', justifyContent : 'space-between'}}>
                                <Text style = {{...FONTS.h4}}>{restaurant?.courier.name}</Text>
                                <View style = {{flexDirection : 'row'}}>
                                    <Image
                                        source = {icons.star}
                                        style = {{
                                            width : 18,
                                            height : 18,
                                            tintColor : COLORS.primary,
                                            marginRight : SIZES.padding
                                        }}  
                                    />
                                    <Text style = {{...FONTS.body3}}>{restaurant?.rating}</Text>
                                    
                                </View>
                            </View>
                            {/* Restaurant Name */}
                            <Text style = {{color : COLORS.darkgray, ...FONTS.body4}}>{restaurant?.name}</Text>
                        </View>
                    </View>
                    {/* Call Buttons */}
                    <View style = {{flexDirection : 'row', marginTop : SIZES.padding * 2, justifyContent : 'space-between'}}>
                        <TouchableOpacity   
                            style = {{  
                                flex : 1,
                                marginRight : 10,
                                height : 50,
                                borderRadius : 10,
                                backgroundColor : COLORS.primary,
                                alignItems : 'center',
                                justifyContent : 'center'
                            }}
                            onPress = {() => navigation.navigate("Home") }
                        >
                            <Text style = {{...FONTS.h4 , color: COLORS.white }}>Call</Text>
                        
                        </TouchableOpacity>
                            
                        <TouchableOpacity
                            style = {{
                                flex : 1,
                                marginRight : 10,
                                height : 50,
                                borderRadius : 10,
                                backgroundColor : COLORS.secondary,
                                alignItems : 'center',
                                justifyContent : 'center'
                            }}  
                            onPress = {() => navigation.goBack() }
                        >
                            <Text style = {{...FONTS.h4 , color: COLORS.white }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    function renderButtons(){
        return(
            <View style = {{position : 'absolute', bottom : SIZES.height*0.35, right : SIZES.padding*2, height : 130, width:60, justifyContent : 'space-between'}}>
               
                {/* Zoom In Button */}
                <TouchableOpacity
                    style = {{
                        width : 60,
                        height : 60,
                        borderRadius : 30,
                        backgroundColor : COLORS.white,
                        alignItems : 'center',
                        justifyContent : 'center'
                    }}
                    onPress = {() => { zoomIn() }}
                    >
                        <Text style = {{...FONTS.body1}}>+</Text>
                </TouchableOpacity>

                {/* Zoom Out Button */}
                <TouchableOpacity
                    style = {{
                        width : 60,
                        height : 60,
                        borderRadius : 30,
                        backgroundColor : COLORS.white,
                        alignItems : 'center',
                        justifyContent : 'center'
                    }}
                    onPress = {() => { zoomOut() }}
                >
                        <Text style = {{...FONTS.body1}}>-</Text>
                </TouchableOpacity>

            </View>
        )
    }  

    return (
        <View style = {{flex : 1}}>
            {renderMap()}
            {renderDestinationHeader()}
            {renderDeliveryInfo()}
            {renderButtons()}
        </View>
    );
}
