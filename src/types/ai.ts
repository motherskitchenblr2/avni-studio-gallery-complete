export interface GenerateRequest {
  prompt: string
  model: string
  size: string
  quality: string
  style: string
  seed?: number
}
 
export interface GenerateResponse {
  id: string
  url: string
  prompt: string
  model: string
  size: string
  quality: string
  style: string
  seed?: number
  timestamp: string
  provider: string
}
 
export interface EditRequest {
  image: File
  tool: string
  intensity: number
  mask?: File
}
 
export interface EditResponse {
  url: string
  tool: string
  adjustments: Record<string, number>
  timestamp: string
  processingTime: number
}
 
export interface EnhanceRequest {
  image: File
  enhanceLevel: 'low' | 'medium' | 'high' | 'ultra'
  features: ('resolution' | 'quality' | 'details' | 'noise')[]
}
 
export interface EnhanceResponse {
  url: string
  originalSize: { width: number; height: number }
  enhancedSize: { width: number; height: number }
  qualityScore: number
  processingTime: number
}
 
export interface StyleTransferRequest {
  image: File
  style: string
  intensity: number
  preserveContent: boolean
}
 
export interface StyleTransferResponse {
  url: string
  style: string
  similarityScore: number
  processingTime: number
}
 
export interface RemoveBackgroundRequest {
  image: File
  mode: 'auto' | 'accurate' | 'fast'
  feather: number
}
 
export interface RemoveBackgroundResponse {
  url: string
  originalSize: { width: number; height: number }
  bgRemovedSize: { width: number; height: number }
  mode: string
  processingTime: number
}
 
export interface ObjectDetectionRequest {
  image: File
  confidence: number
  includeLabels: boolean
}
 
export interface DetectedObject {
  id: string
  label: string
  confidence: number
  bbox: [number, number, number, number] // [x, y, width, height]
  mask?: ImageData
}
 
export interface ObjectDetectionResponse {
  url: string
  objects: DetectedObject[]
  processingTime: number
}
 
export interface FaceDetectionRequest {
  image: File
  detectAll: boolean
  landmarks: boolean
  attributes: ('age' | 'gender' | 'emotion' | 'glasses' | 'pose')[]
}
 
export interface DetectedFace {
  id: string
  bbox: [number, number, number, number]
  confidence: number
  landmarks?: {
    leftEye: { x: number; y: number }
    rightEye: { x: number; y: number }
    nose: { x: number; y: number }
    mouthLeft: { x: number; y: number }
    mouthRight: { x: number; y: number }
  }
  attributes?: {
    age?: number
    gender?: string
    emotion?: string
    glasses?: boolean
    pose?: { roll: number; pitch: number; yaw: number }
  }
}
 
export interface FaceDetectionResponse {
  url: string
  faces: DetectedFace[]
  processingTime: number
}
 
export interface OCRRequest {
  image: File
  language: string
  detectHandwriting: boolean
  extractTable: boolean
}
 
export interface OCRResponse {
  text: string
  words: Array<{
    text: string
    confidence: number
    bbox: [number, number, number, number]
  }>
  table?: Array<Array<string>>
  processingTime: number
}
 
export interface AIProvider {
  id: string
  name: string
  models: Array<{
    id: string
    name: string
    type: 'image-generation' | 'image-editing' | 'analysis'
    capabilities: string[]
    pricing?: {
      perImage?: number
      subscription?: boolean
      rateLimit?: number
    }
  }>
  baseUrl: string
  apiKey?: string
}
 
export interface AIService {
  provider: string
  model: string
  capabilities: string[]
  status: 'active' | 'inactive' | 'error'
  lastUsed?: string
  usage: {
    total: number
    today: number
    monthly: number
  }
}
 
export interface AITask {
  id: string
  type: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  input: any
  output?: any
  error?: string
  startTime: string
  endTime?: string
  duration?: number
}
 
export interface AIAnalytics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageProcessingTime: number
  topModels: Array<{
    model: string
    usage: number
  }>
  usageByDay: Array<{
    date: string
    count: number
  }>
  providerStats: Array<{
    provider: string
    usage: number
    successRate: number
  }>
}
 
export interface AIConfig {
  defaultProvider: string
  providers: Record<string, {
    enabled: boolean
    apiKey?: string
    priority: number
    fallback: boolean
  }>
  limits: {
    maxConcurrent: number
    maxRetries: number
    timeout: number
  }
}
 
export interface AITemplate {
  id: string
  name: string
  description: string
  category: string
  settings: Record<string, any>
  prompt: string
  variables: Array<{
    name: string
    type: string
    description: string
    defaultValue: any
    options?: string[]
  }>
}
 
export interface AITemplatesResponse {
  templates: AITemplate[]
  categories: string[]
}
