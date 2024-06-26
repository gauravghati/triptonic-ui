import { View, Text, Image, ImageBackground, TextInput } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";

import Filter from "@/components/filter";
import NavBar from "@/components/utils/navbar";
import Prompt from "@/components/prompt";
import Map from "@/components/utils/map";
import ActionSheet from "@/components/utils/action-sheet";
import { useAPIStore, usePromptStore } from "@/store";
import Loader from "@/components/loader";
import CoolCallout from "@/components/utils/cool-callout";
import { COLORS } from "assets/constants";
import MapViewDirections from "react-native-maps-directions";
import CoolText from "@/components/utils/cool-text";
import { useToast } from "react-native-toast-notifications";
import { useRouter, useLocalSearchParams } from "expo-router";
import MapTimeline from "@/components/map-timeline";
import { TransportMode } from "@/utils";

export default function Trip() {
  const searchParams = useLocalSearchParams();
  console.log('Received params:', searchParams);
  const { prompt } = usePromptStore();
  const { routes, fetchRoutes, fetchRoutesWithParams, params, fetchTripDetails, setSavedTripId } = useAPIStore();
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [navbarScr, setNavbarScr] = useState(1);
  const mapRef = useRef<MapView>();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const googleMapsAPIKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  const toast = useToast();
  const router = useRouter();
  let modeOfTransport: TransportMode = params.mode_of_transport as TransportMode;
  if (modeOfTransport === 'TRANSIT') {
    modeOfTransport = 'DRIVING';
  }

  const animatetoMarkers = () => {
    if (!isLoading && mapRef.current && routes.length > 0) {
      console.log("Animate to map location!");
      mapRef.current.animateCamera(
        { center: routes[0], zoom: 12 },
        { duration: 2500 }
      );
      // mapRef.current.fitToSuppliedMarkers(
      //   markers.map(({ _id }) => _id),
      //   { animated: true }
      // );
    }
  };

  const handleOpenPress = (scrNo: number) => {
    bottomSheetRef.current?.present();
    setNavbarScr(scrNo);
  };

  useEffect(() => {
    async function fetchDataFromAPI() {

      if (isLoading) {
        console.log('Sending prompt...', prompt);
        console.log('Sending params (if any)', searchParams)
        if ('id' in searchParams) {
          const tripId = searchParams?.id;
          setSavedTripId(tripId);
          const data = await fetchTripDetails(searchParams?.id);

          console.log('Came here from a magic link!')
          console.log('Updated params:', data)
          router.push({ pathname: '/trip', params: { ...data } });
          return;
        }

        const data = (Object.keys(searchParams).length !== 0) 
          ? await fetchRoutesWithParams(searchParams) 
          : await fetchRoutes(prompt);

        if ('error' in data) {
          const errMsg = data['error'];
          console.log('RESPONSE FROM API:', data);
          const toastMsg = (errMsg == 'UNREASONABLE_REQUEST') ? "Nice try. Think again!" : "Something went wrong. Please try again later :(";

          toast.show(toastMsg, {
            type: 'danger',
            duration: 3000,
            swipeEnabled: true,
            animationType: 'zoom-in'
          });
          router.push({ pathname: '/' });
          return;
        }
        setIsLoading(false);
      }
    }
    fetchDataFromAPI();
  }, [isLoading]);

  useEffect(() => {
    animatetoMarkers();
  }, [isLoading, routes]);

  function loadBottomSheetComponent(screenNo: number) {
    if (screenNo === 1) return <Prompt />;
    if (screenNo === 2) return <Filter />;
    return <MapTimeline />;
  }

  if (isLoading && (!mapLoaded)) {
    console.log("Loader rendered");
    return <Loader />;
  }

  return (
    <View className="flex flex-1 bg-egg-white">
      <MapView
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
        provider={PROVIDER_DEFAULT}
        onMapLoaded={() => {
          animatetoMarkers();
          setMapLoaded(true);
        }}
      >
        {routes.map((marker, index) => (
          <Marker key={index} title={marker.name} coordinate={marker}>
            <View
              className="flex flex-1 w-8 h-8 p-1 justify-center items-center rounded-full bg-reddish drop-shadow-2xl text-center"
              style={{ elevation: 3 }}
            >
              <CoolText title={index + 1} css="font-bold color-white" />
            </View>
            <CoolCallout marker={marker} />
          </Marker>
        ))}
        <MapViewDirections
          origin={routes[0]}
          destination={routes[routes.length - 1]}
          waypoints={routes.slice(1, -1)}
          apikey={googleMapsAPIKey}
          strokeWidth={4}
          mode={modeOfTransport}
          strokeColor={COLORS['reddish']}
        />
      </MapView>
      <View className="absolute bottom-14 self-center">
        <NavBar onPress={handleOpenPress} optionNo={navbarScr} />
      </View>
      <ActionSheet
        ref={bottomSheetRef}
        index={0}
        children={loadBottomSheetComponent(navbarScr)}
      />
    </View>
  );
}
