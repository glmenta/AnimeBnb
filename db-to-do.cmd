@REM model generate for spots
npx sequelize model:generate --name Spot --attributes ownerId:integer,address:string,city:string,state:string,country:string,lat:integer,lng:integer,name:string,description:string,price:integer

@REM model generate for reviews
npx sequelize model:generate --name Review --attributes userId:integer,spotId:integer,review:string,stars:integer

@REM model generate for reviewImages
npx sequelize model:generate --name ReviewImage --attributes reviewId:integer,url:string

@REM model generate for spotImages
npx sequelize model:generate --name SpotImage --attributes spotId:integer,url:string,previewImage:boolean

@REM model generate for bookings
npx sequelize model:generate --name Booking --attributes spotId:integer,userId:integer,startDate:date,endDate:date

@REM generate seed for spots
npx sequelize-cli seed:generate --name spots

@REM generate seed for users
npx sequelize-cli seed:generate --name users

@REM generate seed for reviews
npx sequelize-cli seed:generate --name reviews

@REM generate seed for reviewimages
npx sequelize-cli seed:generate --name reviewImages

@REM generate seed for spotimages
npx sequelize-cli seed:generate --name spotImages

@REM generate seed for bookings
npx sequelize-cli seed:generate --name bookings
