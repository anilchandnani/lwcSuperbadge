import { LightningElement, wire, api } from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const ERROR_VARIANT = 'error';
const ERROR_TITLE = 'Error loading Boats Near Me';
const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';

export default class BoatsNearMe extends LightningElement {
    latitude;
    longitude;
    isRendered = false;
    @api boatTypeId;
    mapMarkers = [];
    isLoading = true;

    renderedCallback() {
        if (!this.isRendered) {
            this.getLocationFromBrowser();
        }
        this.isRendered = true;
    }

    getLocationFromBrowser() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.isLoading = true;
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            
        })
    }

    @wire(getBoatsByLocation, { latitude: '$latitude', longitude: '$longitude', boatTypeId: '$boatTypeId' })
    wiredBoatsJSON({ error, data }) {
        if (data) {
            this.createMapMarkers(data);
        } else if (error) {
            const toastEvent = new ShowToastEvent({
                title: ERROR_TITLE,
                variant: ERROR_VARIANT,
                message: JSON.stringify(error)
            });
            this.dispatchEvent(toastEvent);
        }
        this.isLoading = false;
    }

    createMapMarkers(boatData) {
        let records = JSON.parse(boatData);
        this.mapMarkers = records.map(record => {
            return {
                location: {
                    Longitude: record.Geolocation__Longitude__s,
                    Latitude: record.Geolocation__Latitude__s
                },
                title : record.Name
            }
        }
        );
        this.mapMarkers.unshift({
            location: {
                Longitude: this.longitude,
                Latitude: this.latitude,
            },
            title : LABEL_YOU_ARE_HERE,
            icon : ICON_STANDARD_USER
        });
        this.isLoading = false;
    }
}