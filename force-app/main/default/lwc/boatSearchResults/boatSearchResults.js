import { LightningElement, api } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';

export default class BoatSearchResults extends LightningElement {
    @api searchBoats(boatTypeId){
        this.dispatchEvent(new CustomEvent('loading'));
        getBoats({"boatTypeId" : boatTypeId})
        .then(boats => {
            this.dispatchEvent(new CustomEvent('doneloading'));
            //alert(boats.length);
        })
        .catch(error => {
            this.dispatchEvent(new CustomEvent('doneloading'));
            //alert(error);
        });
    }
}