import { LightningElement, api, wire } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { publish, MessageContext } from 'lightning/messageService';
import BoatMC from '@salesforce/messageChannel/BoatMessageChannel__c';

const columns = [
    { label: 'Name', fieldName: 'Name', editable: true },
    { label: 'Length', fieldName: 'Length__c', editable: true },
    { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: true },
    { label: 'Description', fieldName: 'Description__c', editable: true }
];

const SUCCESS_VARIANT = 'success';
const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT = 'Ship It!';
const CONST_ERROR = 'Error';
const ERROR_VARIANT = 'error';

export default class BoatSearchResults extends LightningElement {
    boats;
    boatTypeId;
    selectedBoatId;
    columns = columns;
    draftValues;

    @wire(MessageContext) messageContext;

    @api searchBoats(boatTypeId) {
        this.boatTypeId = boatTypeId;
        this.notifyLoading(true);
    }

    @wire(getBoats, { boatTypeId: '$boatTypeId' })
    wiredBoats(result) {
        this.boats = result;
        if (result.error) {

        }
        this.notifyLoading(false);
    }

    updateSelectedTile(event) {
        this.selectedBoatId = event.detail.boatId;
        this.sendMessageService(event.detail.boatId);
    }

    /*handleSave(event) {
        this.notifyLoading(true);
        this.draftValues = event.detail.draftValues;
        let singlePromises = updateBoatList({
            data: this.draftValues
        });
        let promises = [singlePromises];
        Promise.all(promises)
            .then(result => {
                const toastEvent = new ShowToastEvent({
                    "variant": SUCCESS_VARIANT,
                    "title": SUCCESS_TITLE,
                    "message": MESSAGE_SHIP_IT
                }
                );
                this.dispatchEvent(toastEvent);
                return this.refresh();
            })
            .catch(error => {
                const toastEvent = new ShowToastEvent({
                    "variant": ERROR_VARIANT,
                    "title": CONST_ERROR,
                    "message": JSON.stringify(error)
                }
                );
                this.dispatchEvent(toastEvent);
                this.notifyLoading(false);
            }).finally(() => {
                this.draftValues = [];
            });
    }*/
    handleSave(event) {
        this.notifyLoading(true);
       const recordInputs = event.detail.draftValues.slice().map(draft=>{
           const fields = Object.assign({}, draft);
           return {fields};
       });

       console.log(recordInputs);
       const promises = recordInputs.map(recordInput => updateRecord(recordInput));
       Promise.all(promises).then(res => {
           this.dispatchEvent(
               new ShowToastEvent({
                   title: SUCCESS_TITLE,
                   message: MESSAGE_SHIP_IT,
                   variant: SUCCESS_VARIANT
               })
           );
           this.draftValues = [];
           return this.refresh();
       }).catch(error => {
           this.error = error;
           this.dispatchEvent(
                new ShowToastEvent({
                    title: ERROR_TITLE,
                    message: CONST_ERROR,
                    variant: ERROR_VARIANT
                })
            );
            this.notifyLoading(false);
       }).finally(() => {
            this.draftValues = [];
        });
    }

    @api
    async refresh() {
        this.notifyLoading(true);
        await refreshApex(this.boats);
        this.notifyLoading(false);
    }

    sendMessageService(boatId) {
        publish(this.messageContext, BoatMC, { recordId: boatId });
    }

    notifyLoading(isLoading) {
        this.dispatchEvent(new CustomEvent(isLoading ? 'loading' : 'doneloading'));
    }

}