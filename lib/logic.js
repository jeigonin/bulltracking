
    /*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/* global getAssetRegistry getParticipantRegistry getFactory getRandomId */

/**
 *
 * @param {com.biz.AnimalDeparture} movement - model instance
 * @transaction
 */
async function onAnimalDeparture(movement) {  // eslint-disable-line no-unused-vars
    console.log('Checking if Aniaml is in farm');
    if (movement.animal.movementStatus !== 'IN_FIELD') {
        throw new Error('Animal is already IN_TRANSIT');
    }

     // set the movement status of the animal
    movement.animal.movementStatus = 'IN_TRANSIT';
     // set the shipment of the animal
    movement.animal.shipment = getFactory().newRelationship('com.biz', 'Shipment', movement.shipment.getIdentifier());


     // save the animal
    const an = await getAssetRegistry('com.biz.Animal');
    await an.update(movement.animal);

    console.log('Animal in transit');
}

async function onAnimalArrival(movement) {  // eslint-disable-line no-unused-vars
    console.log('Checking if Aniaml is in transit');
    if (movement.animal.movementStatus !== 'IN_TRANSIT') {
        throw new Error('Animal is not IN_TRANSIT');
    }

     // set the movement status of the animal
    movement.animal.movementStatus = 'IN_MARKET';

     // save the animal
    const an = await getAssetRegistry('com.biz.Animal');
    await an.update(movement.animal);

    // set the marketREceiver of the animal in the shipment
    movement.animal.shipment.arrivalDate = new Date();
    movement.animal.shipment.marketArrival = getFactory().newRelationship('com.biz', 'Market', movement.marketReceiver.getIdentifier());
    const sh = await getAssetRegistry('com.biz.Shipment');
    await sh.update(movement.animal.shipment);


    console.log('Animal Arrived in the market');
}

async function onAnimalRetail(movement) {  // eslint-disable-line no-unused-vars
    console.log('Checking if Aniaml is in the market');
    if (movement.meat.animal.movementStatus !== 'IN_MARKET') {
        throw new Error('Animal is not IN_MARKET');
    }

     // set the movement status of the animal
    movement.meat.animal.movementStatus = 'IN_STORE';

     // save the animal
    const an = await getAssetRegistry('com.biz.Animal');
    await an.update(movement.meat.animal);

    console.log('Meat arrived in the store section');
}
