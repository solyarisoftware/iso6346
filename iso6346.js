#!/usr/bin/env node

//
// https://github.com/sameersemna/Container-validator-JS/blob/master/ContainerValidator.js#L211
//
const path = require('path')

const EQUIPS = require('./data/equips.json')
const GROUPS = require('./data/groups.json')
const OWNERS = require('./data/owners.json')
const SIZES = require('./data/sizes.json')
const TYPES = require('./data/types.json')


/**
 *  is valid marking?
 *
 *  @param {String} marking (at least 11 chars). e.g. CSQU3054383
 *  @return {Boolean} truie if marking is valid
 *
 */  
const isValidCode = (marking) => {

  // takes first 11 chars
  const markingWhithoutCheckDigit = marking.slice(0,10) 

  // the check digit( eleventh char), as number
  const checkDigitInCode =  + marking.slice(10,11)

  return ( checkDigitInCode === calculateCheckDigit(markingWhithoutCheckDigit) )
}  


const validateType = (typeCode) => {

  const foundType = TYPES[typeCode]

  return foundType ? foundType : '✘ unknown type'
}  



const validateEquipement = (equipementCode) => {

  const foundEquipement = EQUIPS[equipementCode]

  return foundEquipement ? foundEquipement : '✘ unknown equipement'
}  


const validateLength = (length) => {

  const foundLength = SIZES.length[length]

  return foundLength ? foundLength : '✘ unknown length code'
}  


/**
 * validate heigth and width
 *
 * @return {object}
 * example:
 *  {
 *    "height": "2438 mm",
 *    "width": "2436 mm"
 *  }
 *
 */ 
const validateHeightWidth = (heightWidth) => {

  const foundHeightWidth = SIZES.heightWidth[heightWidth]

  return foundHeightWidth ? foundHeightWidth : { 
    height: '✘ unknown height', 
    width: '✘ unknown width' 
  }
}  


const validateOwner = (ownerCode) => {

  const foundOwner = OWNERS[ownerCode]

  if ( foundOwner ) {
    return `${foundOwner.company}
                                 ${foundOwner.city}
                                 ${foundOwner.country}`    
  }  
  return '✘ unknown owner'
}  
 

//
// An equivalent numerical value is assigned to each letter of the alphabet, beginning with 10 for the letter A (11 and multiples thereof are omitted):
//
const asNumber = {

  // digits
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,

  // letters
  'A': 10,
  'B': 12,
  'C': 13,
  'D': 14,
  'E': 15,
  'F': 16,
  'G': 17,
  'H': 18,
  'I': 19,
  'J': 20,
  'K': 21,
  'L': 23,
  'M': 24,
  'N': 25,
  'O': 26,
  'P': 27,
  'Q': 28,
  'R': 29,
  'S': 30,
  'T': 31,
  'U': 32,
  'V': 34,
  'W': 35,
  'X': 36,
  'Y': 37,
  'Z': 38

}


//
// Each of the numbers calculated in step 1 is multiplied by 2 exponent position, 
// where position is the exponent to base 2. 
// Position starts at 0, from left to right.
// 1. nbr	2. nbr	3. nbr	4. nbr	5. nbr	6. nbr	7. nbr	8. nbr	9. nbr	10. nbr
// 0	1	2	3	4	5	6	7	8	9
// 1	2	4	8	16	32	64	128	256	512
//
const positionalWeight = (number, position) => number * ( 1 << position )


/**
 * calculate check digit
 *
 * @param {String} marking (at least 11 chars). e.g. CSQU3054383
 * @return {Number} check digit, as number
 *
 */ 
const calculateCheckDigit = (marking) => {

  let sumDigit = 0

  for(let i = 0; i < marking.length; i++) 
    sumDigit += positionalWeight( asNumber[ marking[i] ], i )
  
  const sumDigitDiff = Math.floor(sumDigit / 11) * 11

  const checkDigit = sumDigit - sumDigitDiff

  return (checkDigit === 10) ? 0 : checkDigit
}




/**
 * split marking in separate fields
 *
 */ 
const splitCode = (marking) => {
  return {
    ownerCode: marking.slice(0,3),
    categoryIdentifier: marking.slice(3,4),
    serialNumber: marking.slice(4,10),
    checkDigit: marking.slice(10, 11),

    length: marking.slice(11,12),
    heightWidth: marking.slice(12,13),
    type: marking.slice(13,15),

  }
}


const explainShort = (
  ownerCode, 
  categoryIdentifier, 
  serialNumber, 
  checkDigit, 
  validation, 
  checkDigitReport
) => {
  return `
  ${ownerCode} ${categoryIdentifier} ${serialNumber} ${checkDigit} ${validation}
    ↑ ↑      ↑ ↑
    │ │      │ │
    │ │      │ └─── check digit: ${checkDigit} ${checkDigitReport}
    │ │      └─── serial number: ${serialNumber}
    │ │
    │ └─────────────── category: ${validateEquipement(categoryIdentifier)}
    └──────────────────── owner: ${validateOwner(ownerCode)}
  `
}


const explainLong = (
  ownerCode, 
  categoryIdentifier, 
  serialNumber, 
  checkDigit, 
  validation, 
  checkDigitReport, 
  length, 
  heightWidth, 
  type
) => {
  return `
  ${ownerCode} ${categoryIdentifier} ${serialNumber} ${checkDigit}  ${length} ${heightWidth} ${type} ${validation}
    ↑ ↑      ↑ ↑  ↑ ↑ ↑
    │ │      │ │  │ │ │
    │ │      │ │  │ │ └─── type: ${validateType(type)}  
    │ │      │ │  │ └─── height: ${validateHeightWidth(heightWidth).height}
    │ │      │ │  │       width: ${validateHeightWidth(heightWidth).width}
    │ │      │ │  └───── length: ${validateLength(length)} 
    │ │      │ │  
    │ │      │ └─── check digit: ${checkDigit} ${checkDigitReport}
    │ │      └─── serial number: ${serialNumber}
    │ │
    │ └─────────────── category: ${validateEquipement(categoryIdentifier)}
    └──────────────────── owner: ${validateOwner(ownerCode)}
  `
}


/**
 * explain marking with pretty printing
 */ 
const explain = (marking, mode) => {

  let validation
  let checkDigitReport

  const { 
    ownerCode, 
    categoryIdentifier, 
    serialNumber, 
    checkDigit,
    length,
    heightWidth,
    type
  } = splitCode(marking)

  if ( isValidCode(marking) ) {
    validation ='✔' //'🆗' 
    checkDigitReport = '' //'. VALID CODE'
  }  
  else {  
    validation = '✘' //'⚠️''─''😵' 
    
    const markingWhithoutCheckDigit = marking.slice(0,10)
    checkDigitReport = `✘ CHECK DIGIT ERROR. Correct check digit is: ${calculateCheckDigit(markingWhithoutCheckDigit)}` 
  }  

  if (mode === 11)

   return explainShort(
     ownerCode, 
     categoryIdentifier, 
     serialNumber, 
     checkDigit, 
     validation, 
     checkDigitReport)
 
  else 

   return explainLong(
     ownerCode, 
     categoryIdentifier, 
     serialNumber, 
     checkDigit, 
     validation, 
     checkDigitReport,

     length, 
     heightWidth, 
     type
   ) 
}  


/**
 * reduce marking 
 * get marking joining command line paramaters, removing blanks, '_' or '-'
 */ 
const reduceMarking = (marking) => marking.replace(/[\s_-]/g, '').toUpperCase()
//const hasValidLen = (marking) => marking.length >= 11


const help = () => {

  const programName = path.basename(process.argv[1])
  
  console.log(`
  usage   : ${programName} <container marking code>

  examples: ${programName} CSQU3054383
            ${programName} CSQ U 305438 3 201G
            ${programName} RAIU 6900114 25U1

  db:
    equipements: ${Object.keys(OWNERS).length}
    owners     : ${Object.keys(EQUIPS).length}
    types      : ${Object.keys(TYPES).length}
`)
}  


/*
 * for unit test
 * @private
 */
function main() {

  if ( process.argv.length < 3 ) {
    help()
    process.exit(1)
  }

  const cliMarking = process.argv.slice(2).join(' ')
  const marking = reduceMarking( cliMarking )

  if ( marking.length === 11 )
    console.log( explain(marking, 11) )
  else if ( marking.length === 15 )
    console.log( explain(marking, 15) )
  else {
    console.log()
    console.log( `  ${cliMarking} ✘` )
    console.log( `  The marking length of ${marking} is ${marking.length}, but it must be at least 11 characters` )
    console.log()
  }  

}

if (require.main === module)
  main()


// TODO
module.exports = {}

