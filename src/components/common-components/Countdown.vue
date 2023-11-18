<script setup>
    import {Countdown} from 'vue3-flip-countdown'
    import moment from "moment"

    const props = defineProps({
        coefficientSize: {
            type: Number,
            default: 1,
        },
        deadlineInMilis: {
            type: Number,
            default: new Date().getTime()
        }
    })

    let defaultCountdownSize = 3 //rem
    let defaultLabelSize = 1.2 //rem

    const configLabel = {days: 'Ngày',hours: 'Giờ',minutes: 'Phút',seconds: 'Giây',}

</script>

<template>
    <Countdown
        :deadline="moment(props.deadlineInMilis).format('YYYY-MM-DD HH:mm:ss')"
        mainFlipBackgroundColor="#1A56DB"
        secondFlipBackgroundColor="#1A56DB"
        mainColor="#FFFFFF"
        secondColor="#FFFFFF"
        :countdownSize="`${defaultCountdownSize*props.coefficientSize}rem`"
        :labelSize="`${defaultLabelSize*props.coefficientSize}rem`"
        :labels="configLabel"
    />
</template>