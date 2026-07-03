import { NextRequest, NextResponse } from 'next/server'
import { GenerateRequest, GenerateResponse } from '@/types/ai'
 
// Mock AI providers configuration
const aiProviders = {
  'openai-dall-e-3': {
    name: 'DALL-E 3',
    endpoint: 'https://api.openai.com/v1/images/generations',
    apiKey: process.env.OPENAI_API_KEY,
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  },
  'stability-sd-xl': {
    name: 'Stable Diffusion XL',
    endpoint: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
    apiKey: process.env.STABILITY_API_KEY,
    headers: {
      'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
      'Content-Type': 'application/json'
    }
  },
  'midjourney-v6': {
    name: 'Midjourney V6',
    endpoint: 'https://api.midjourney.com/v6/generate',
    apiKey: process.env.MIDJOURNEY_API_KEY,
    headers: {
      'Authorization': `Bearer ${process.env.MIDJOURNEY_API_KEY}`,
      'Content-Type': 'application/json'
    }
  }
}
 
export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    
    // Validate request
    if (!body.prompt || !body.model || !body.size) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
 
    const provider = aiProviders[body.model as keyof typeof aiProviders]
    if (!provider) {
      return NextResponse.json(
        { error: 'Unsupported model' },
        { status: 400 }
      )
    }
 
    if (!provider.apiKey) {
      return NextResponse.json(
        { error: 'API key not configured for this provider' },
        { status: 500 }
      )
    }
 
    // Prepare request based on provider
    let requestBody: any = {}
    
    if (body.model === 'openai-dall-e-3') {
      requestBody = {
        model: 'dall-e-3',
        prompt: body.prompt,
        n: 1,
        size: body.size,
        quality: body.quality,
        style: body.style,
        response_format: 'url'
      }
    } else if (body.model === 'stability-sd-xl') {
      requestBody = {
        text_prompts: [
          {
            text: body.prompt,
            weight: 1
          }
        ],
        cfg_scale: body.intensity || 7,
        height: parseInt(body.size.split('x')[1]) || 1024,
        width: parseInt(body.size.split('x')[0]) || 1024,
        samples: 1,
        steps: body.quality === 'ultra_hd' ? 50 : 30,
        seed: body.seed
      }
    } else if (body.model === 'midjourney-v6') {
      requestBody = {
        prompt: body.prompt,
        model: 'midjourney-v6',
        size: body.size,
        quality: body.quality,
        style: body.style,
        seed: body.seed
      }
    }
 
    // Make API call to the selected provider
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: provider.headers,
      body: JSON.stringify(requestBody)
    })
 
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error || 'Generation failed' },
        { status: response.status }
      )
    }
 
    const data = await response.json()
    
    // Parse response based on provider
    let imageUrl: string
    
    if (body.model === 'openai-dall-e-3') {
      imageUrl = data.data[0].url
    } else if (body.model === 'stability-sd-xl') {
      imageUrl = data.artifacts[0].base64
      // Convert base64 to URL (in production, you'd upload to cloud storage)
      const base64Data = imageUrl.replace(/^data:image\/[a-z]+;base64,/, '')
      imageUrl = `data:image/png;base64,${base64Data}`
    } else {
      imageUrl = data.imageUrl // Placeholder for Midjourney
    }
 
    // Generate response
    const result: GenerateResponse = {
      id: crypto.randomUUID(),
      url: imageUrl,
      prompt: body.prompt,
      model: body.model,
      size: body.size,
      quality: body.quality,
      style: body.style,
      seed: body.seed,
      timestamp: new Date().toISOString(),
      provider: provider.name
    }
 
    // Store the generated image in database (mock)
    await saveGeneratedImage(result)
 
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in generate API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
 
async function saveGeneratedImage(image: GenerateResponse) {
  // In production, this would save to a database
  console.log('Saving generated image:', image.id)
  
  // Store in localStorage for demo purposes
  const savedImages = JSON.parse(localStorage.getItem('generatedImages') || '[]')
  savedImages.unshift(image)
  if (savedImages.length > 50) savedImages.pop() // Keep last 50 images
  localStorage.setItem('generatedImages', JSON.stringify(savedImages))
}
