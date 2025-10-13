#version 330 core
// 1. ESTRUCTURAS DE MATERIAL Y LUZ
struct Material
{
    sampler2D texture_diffuse1; 
    sampler2D texture_specular1; 
    float shininess;
};

struct PointLight
{
    vec3 position;
    
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

// 2. UNIFORMS
in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoords;

out vec4 color;

uniform vec3 viewPos;
uniform Material material;
uniform PointLight sun; 
uniform PointLight moon;

// 3. FUNCIÓN DE CÁLCULO DE LUZ DE PUNTO
vec3 CalcPointLight(PointLight light, vec3 norm, vec3 fragPos, vec3 viewDir)
{
    // Color de la textura del fragmento (Albedo)
    vec3 textureColor = vec3(texture(material.texture_diffuse1, TexCoords));

    // A. Componente AMBIENTE
    vec3 ambient = light.ambient * textureColor;
    
    // B. Componente DIFUSO (Lambertian)
    vec3 lightDir = normalize(light.position - fragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = light.diffuse * diff * textureColor; // ¡CORRECCIÓN AQUÍ! Debe ser light.diffuse

    // C. Componente ESPECULAR (Phong)
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    vec3 specular = light.specular * (spec * texture(material.texture_specular1, TexCoords).rgb); // Usar mapa especular si existe
    
    return (ambient + diffuse + specular);
}

// 4. FUNCIÓN MAIN (SUMA DE LUCES)
void main()
{
    vec3 norm = normalize(Normal);
    vec3 viewDir = normalize(viewPos - FragPos);
    
    // Calcula y suma la contribución de ambas luces (Sol y Luna)
    vec3 resultSun = CalcPointLight(sun, norm, FragPos, viewDir);
    vec3 resultMoon = CalcPointLight(moon, norm, FragPos, viewDir);
    
    vec3 finalResult = resultSun + resultMoon;
    
    color = vec4(finalResult, 1.0f);
}