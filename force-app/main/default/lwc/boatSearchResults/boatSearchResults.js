import { LightningElement, api, wire } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';

export default class BoatSearchResults extends LightningElement {
    boats;
    boatTypeId;
    selectedBoatId;

    @api searchBoats(boatTypeId) {
        this.boatTypeId = boatTypeId;
        this.dispatchEvent(new CustomEvent('loading'));
    }

    @wire(getBoats, { boatTypeId: '$boatTypeId' })
    wiredBoats(result) {
        this.boats = result;
        if (result.error) {

        }
        this.dispatchEvent(new CustomEvent('doneloading'));
    }

    updateSelectedTile(event) {
        this.selectedBoatId = event.detail.boatId;
    }
}