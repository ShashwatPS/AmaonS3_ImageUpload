import {NextResponse} from "next/server";
import { S3Client, PutObjectCommand} from "@aws-sdk/client-s3"

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    }
});


export async function POST(request){
    try {

    } catch (error){
        return NextResponse.json({error})
    }
}